import OpenAI from "openai";

const openrouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY ?? "missing-openrouter-api-key",
  baseURL: "https://openrouter.ai/api/v1",
});

export function getOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
}

export default openrouterClient;
