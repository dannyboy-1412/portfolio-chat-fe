const COOLDOWN_MS = 5 * 60 * 1000;

/**
 * Ordered chat model registry for OpenRouter.
 * Primary first; peers chosen for similar cost/intelligence to gpt-5.6-luna.
 */
export const CHAT_MODELS = [
  "openai/gpt-5.6-luna",
  "google/gemini-2.5-flash-lite",
  "openai/gpt-4o-mini",
  "anthropic/claude-3-haiku",
] as const;

export type ChatModel = (typeof CHAT_MODELS)[number];

const rateLimitedUntil = new Map<string, number>();

function now(): number {
  return Date.now();
}

function isCooledDown(model: string, at: number = now()): boolean {
  const until = rateLimitedUntil.get(model);
  if (until === undefined) {
    return false;
  }
  if (until <= at) {
    rateLimitedUntil.delete(model);
    return false;
  }
  return true;
}

export function primaryModel(): string {
  return CHAT_MODELS[0];
}

export function availableModels(): string[] {
  const at = now();
  const ready = CHAT_MODELS.filter((model) => !isCooledDown(model, at));
  if (ready.length === 0) {
    return [...CHAT_MODELS];
  }
  return [...ready];
}

export function markRateLimited(model: string, at: number = now()): void {
  rateLimitedUntil.set(model, at + COOLDOWN_MS);
}

/** Test helper — clears in-memory cooldowns. */
export function resetModelCooldowns(): void {
  rateLimitedUntil.clear();
}

/** Test helper — overrides cooldown expiry for a model. */
export function setModelCooldownUntil(model: string, until: number): void {
  rateLimitedUntil.set(model, until);
}
