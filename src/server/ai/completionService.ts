import openrouterClient, { getOpenRouterModel } from "@/server/ai/openrouterClient";
import { getSystemPrompt } from "@/server/ai/systemPrompt";
import type { OpenAIMessage } from "@/server/chat/schemas";

export async function generateCompletion(conversation: OpenAIMessage[]) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  return openrouterClient.chat.completions.create({
    model: getOpenRouterModel(),
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
}
