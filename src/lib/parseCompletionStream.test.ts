import { describe, expect, it } from "vitest";
import {
  consumeCompletionStreamChunk,
  parseCompletionStreamFrame,
} from "@/lib/parseCompletionStream";

function frame(
  label: "metadata" | "message",
  payload: Record<string, string>
): string {
  return `${label}/&\ndata: ${JSON.stringify(payload)}/&\n\n`;
}

describe("parseCompletionStreamFrame", () => {
  it("parses assistant_message_id metadata JSON without quote-wrapping", () => {
    const id = "11111111-1111-1111-1111-111111111111";
    const payload = parseCompletionStreamFrame(
      `\ndata: ${JSON.stringify({ assistant_message_id: id })}`
    );

    expect(payload).toEqual({ assistant_message_id: id });
  });

  it("parses content JSON that contains quotes and punctuation", () => {
    const content = 'He said "hello", then left.';
    const payload = parseCompletionStreamFrame(
      `\ndata: ${JSON.stringify({ content })}`
    );

    expect(payload).toEqual({ content });
  });

  it("ignores labels and done markers without data payloads", () => {
    expect(parseCompletionStreamFrame("metadata")).toBeNull();
    expect(parseCompletionStreamFrame("message")).toBeNull();
    expect(parseCompletionStreamFrame("[DONE]")).toBeNull();
    expect(parseCompletionStreamFrame("data: [DONE]")).toBeNull();
  });

  it("throws on malformed JSON instead of silently corrupting it", () => {
    expect(() =>
      parseCompletionStreamFrame('data: {"content":')
    ).toThrow(SyntaxError);
  });
});

describe("consumeCompletionStreamChunk", () => {
  it("parses a full metadata + content + done sequence from one chunk", () => {
    const id = "22222222-2222-2222-2222-222222222222";
    const chunk =
      frame("metadata", { assistant_message_id: id }) +
      frame("message", { content: "Hi" }) +
      frame("message", { content: " there" }) +
      "[DONE]/&\n\n";

    const result = consumeCompletionStreamChunk("", chunk);

    expect(result.buffer).toBe("\n\n");
    expect(result.payloads).toEqual([
      { assistant_message_id: id },
      { content: "Hi" },
      { content: " there" },
    ]);
  });

  it("buffers incomplete frames split across network chunks", () => {
    const id = "33333333-3333-3333-3333-333333333333";
    const full = frame("metadata", { assistant_message_id: id });
    const splitAt = full.indexOf("assistant_message_id") + 10;

    const first = consumeCompletionStreamChunk("", full.slice(0, splitAt));
    expect(first.payloads).toEqual([]);
    expect(first.buffer.length).toBeGreaterThan(0);

    const second = consumeCompletionStreamChunk(
      first.buffer,
      full.slice(splitAt)
    );

    expect(second.payloads).toEqual([{ assistant_message_id: id }]);
  });

  it("reproduces the previous double-parse failure mode as a regression guard", () => {
    const raw = JSON.stringify({
      assistant_message_id: "44444444-4444-4444-4444-444444444444",
    });

    // Legacy chatbot did: JSON.parse(JSON.parse(`"${raw}"`)) / JSON.parse(`"${raw}"`)
    expect(() => JSON.parse(`"${raw}"`)).toThrow(
      /Unexpected non-whitespace character after JSON/
    );

    expect(parseCompletionStreamFrame(`\ndata: ${raw}`)).toEqual({
      assistant_message_id: "44444444-4444-4444-4444-444444444444",
    });
  });
});
