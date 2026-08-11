export type CompletionStreamPayload = {
  content?: string;
  assistant_message_id?: string;
};

export type ConsumeCompletionStreamResult = {
  buffer: string;
  payloads: CompletionStreamPayload[];
};

/**
 * Parses one network chunk of the completions SSE wire format.
 * Frames are delimited by `/&`; JSON lives after `data:`.
 * Incomplete trailing frames stay in `buffer` until the next chunk.
 */
export function consumeCompletionStreamChunk(
  buffer: string,
  chunk: string
): ConsumeCompletionStreamResult {
  const combined = buffer + chunk;
  const parts = combined.split("/&");
  const nextBuffer = parts.pop() ?? "";
  const payloads: CompletionStreamPayload[] = [];

  for (const part of parts) {
    try {
      const payload = parseCompletionStreamFrame(part);
      if (payload) {
        payloads.push(payload);
      }
    } catch {
      // Skip malformed frames; caller may still receive later valid chunks.
    }
  }

  return { buffer: nextBuffer, payloads };
}

export function parseCompletionStreamFrame(
  part: string
): CompletionStreamPayload | null {
  const dataIndex = part.indexOf("data:");
  if (dataIndex === -1) {
    return null;
  }

  const raw = part.slice(dataIndex + "data:".length).trim();
  if (!raw || raw === "[DONE]") {
    return null;
  }

  const parsed = JSON.parse(raw) as CompletionStreamPayload;
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    (parsed.content === undefined && parsed.assistant_message_id === undefined)
  ) {
    return null;
  }

  return parsed;
}
