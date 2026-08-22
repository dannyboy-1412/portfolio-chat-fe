import { describe, expect, it } from "vitest";
import { messageSchema } from "@/server/chat/schemas";

describe("messageSchema", () => {
  it("accepts a message without context fields", () => {
    const result = messageSchema.safeParse({ role: "user", content: "hi" });
    expect(result.success).toBe(true);
  });

  it("accepts a project context", () => {
    const result = messageSchema.safeParse({
      role: "user",
      content: "tell me about mesha",
      context_type: "project",
      context_id: "mesha",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an experience context", () => {
    const result = messageSchema.safeParse({
      role: "user",
      content: "tell me about infrrd",
      context_type: "experience",
      context_id: "infrrd",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid context_type", () => {
    const result = messageSchema.safeParse({
      role: "user",
      content: "hi",
      context_type: "company",
      context_id: "mesha",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an explicit null context", () => {
    const result = messageSchema.safeParse({
      role: "user",
      content: "hi",
      context_type: null,
      context_id: null,
    });
    expect(result.success).toBe(true);
  });
});
