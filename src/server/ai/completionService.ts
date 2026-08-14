import OpenAI from "openai";
import openrouterClient from "@/server/ai/openrouterClient";
import {
  availableModels,
  markRateLimited,
} from "@/server/ai/modelRotation";
import { getSystemPrompt } from "@/server/ai/systemPrompt";
import type { OpenAIMessage } from "@/server/chat/schemas";

export class AllModelsRateLimitedError extends Error {
  constructor(triedModels: string[]) {
    super(
      `All chat models rate-limited or unavailable: ${triedModels.join(", ")}`
    );
    this.name = "AllModelsRateLimitedError";
  }
}

type ChatCompletionChunk = OpenAI.Chat.Completions.ChatCompletionChunk;
type ChatCompletionStream = AsyncIterable<ChatCompletionChunk>;

export type PrimedCompletionStream = {
  model: string;
  stream: AsyncGenerator<ChatCompletionChunk, void, unknown>;
};

function isFallbackWorthy(error: unknown): boolean {
  if (!(error instanceof OpenAI.APIError)) {
    return false;
  }
  const status = error.status;
  if (status === undefined) {
    return false;
  }
  return status === 429 || status === 402 || status >= 500;
}

async function* replayThenContinue(
  firstChunk: ChatCompletionChunk,
  rest: ChatCompletionStream
): AsyncGenerator<ChatCompletionChunk, void, unknown> {
  yield firstChunk;
  for await (const chunk of rest) {
    yield chunk;
  }
}

async function createPrimedStream(
  model: string,
  conversation: OpenAIMessage[]
): Promise<PrimedCompletionStream> {
  const stream = await openrouterClient.chat.completions.create({
    model,
    messages: [
      { role: "system", content: getSystemPrompt() },
      ...conversation.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
    ],
    temperature: 0.2,
    stream: true,
  });

  const iterator = stream[Symbol.asyncIterator]();
  const first = await iterator.next();

  if (first.done) {
    return {
      model,
      stream: (async function* empty() {
        /* no chunks */
      })(),
    };
  }

  return {
    model,
    stream: replayThenContinue(first.value, {
      [Symbol.asyncIterator]: () => iterator,
    }),
  };
}

export async function generateCompletion(
  conversation: OpenAIMessage[]
): Promise<PrimedCompletionStream> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const models = availableModels();
  const tried: string[] = [];

  for (const model of models) {
    tried.push(model);
    try {
      return await createPrimedStream(model, conversation);
    } catch (error) {
      if (!isFallbackWorthy(error)) {
        throw error;
      }
      console.warn(
        `OpenRouter model ${model} unavailable (${error instanceof OpenAI.APIError ? error.status : "unknown"}); trying fallback`
      );
      markRateLimited(model);
    }
  }

  throw new AllModelsRateLimitedError(tried);
}
