import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OpenAI from "openai";

const createMock = vi.fn();

vi.mock("@/server/ai/openrouterClient", () => ({
  default: {
    chat: {
      completions: {
        create: (...args: unknown[]) => createMock(...args),
      },
    },
  },
}));

vi.mock("@/server/ai/systemPrompt", () => ({
  getSystemPrompt: () => "test system prompt",
}));

import {
  AllModelsRateLimitedError,
  generateCompletion,
} from "@/server/ai/completionService";
import { CHAT_MODELS, resetModelCooldowns } from "@/server/ai/modelRotation";

function apiError(status: number): InstanceType<typeof OpenAI.APIError> {
  return new OpenAI.APIError(
    status,
    { error: { message: "rate limited" } },
    "rate limited",
    new Headers()
  );
}

async function* chunkStream(content: string) {
  yield {
    id: "chunk-1",
    object: "chat.completion.chunk" as const,
    created: 0,
    model: "test",
    choices: [
      {
        index: 0,
        delta: { content },
        finish_reason: null,
      },
    ],
  };
}

describe("generateCompletion fallback", () => {
  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = "test-key";
    resetModelCooldowns();
    createMock.mockReset();
  });

  afterEach(() => {
    resetModelCooldowns();
  });

  it("falls back to the next model after a 429", async () => {
    createMock
      .mockRejectedValueOnce(apiError(429))
      .mockResolvedValueOnce(chunkStream("hello from fallback"));

    const primed = await generateCompletion([{ role: "user", content: "hi" }]);

    expect(primed.model).toBe(CHAT_MODELS[1]);
    expect(createMock).toHaveBeenCalledTimes(2);
    expect(createMock.mock.calls[0][0].model).toBe(CHAT_MODELS[0]);
    expect(createMock.mock.calls[1][0].model).toBe(CHAT_MODELS[1]);

    const chunks = [];
    for await (const chunk of primed.stream) {
      chunks.push(chunk);
    }
    expect(chunks[0]?.choices[0]?.delta?.content).toBe("hello from fallback");
  });

  it("falls back on 402 and 5xx", async () => {
    createMock
      .mockRejectedValueOnce(apiError(402))
      .mockRejectedValueOnce(apiError(503))
      .mockResolvedValueOnce(chunkStream("ok"));

    const primed = await generateCompletion([{ role: "user", content: "hi" }]);

    expect(primed.model).toBe(CHAT_MODELS[2]);
    expect(createMock).toHaveBeenCalledTimes(3);
  });

  it("skips a cooled-down model on a later request", async () => {
    createMock
      .mockRejectedValueOnce(apiError(429))
      .mockResolvedValueOnce(chunkStream("first"))
      .mockResolvedValueOnce(chunkStream("second"));

    await generateCompletion([{ role: "user", content: "one" }]);
    createMock.mockClear();

    const primed = await generateCompletion([{ role: "user", content: "two" }]);

    expect(primed.model).toBe(CHAT_MODELS[1]);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock.mock.calls[0][0].model).toBe(CHAT_MODELS[1]);
  });

  it("throws AllModelsRateLimitedError when every model fails with 429", async () => {
    createMock.mockRejectedValue(apiError(429));

    await expect(
      generateCompletion([{ role: "user", content: "hi" }])
    ).rejects.toBeInstanceOf(AllModelsRateLimitedError);

    expect(createMock).toHaveBeenCalledTimes(CHAT_MODELS.length);
  });

  it("rethrows non-fallback errors immediately", async () => {
    createMock.mockRejectedValueOnce(apiError(400));

    await expect(
      generateCompletion([{ role: "user", content: "hi" }])
    ).rejects.toMatchObject({ status: 400 });

    expect(createMock).toHaveBeenCalledTimes(1);
  });
});
