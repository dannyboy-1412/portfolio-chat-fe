import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CHAT_MODELS,
  availableModels,
  markRateLimited,
  primaryModel,
  resetModelCooldowns,
  setModelCooldownUntil,
} from "@/server/ai/modelRotation";

afterEach(() => {
  resetModelCooldowns();
  vi.useRealTimers();
});

describe("modelRotation", () => {
  it("returns the primary model as the first registry entry", () => {
    expect(primaryModel()).toBe(CHAT_MODELS[0]);
  });

  it("returns the full registry when nothing is rate-limited", () => {
    expect(availableModels()).toEqual([...CHAT_MODELS]);
  });

  it("hides a model during its cooldown window", () => {
    markRateLimited(CHAT_MODELS[0]);
    expect(availableModels()).toEqual(CHAT_MODELS.slice(1));
  });

  it("restores a model after the cooldown expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    markRateLimited(CHAT_MODELS[0]);
    expect(availableModels()).not.toContain(CHAT_MODELS[0]);

    vi.advanceTimersByTime(5 * 60 * 1000 + 1);
    expect(availableModels()).toContain(CHAT_MODELS[0]);
  });

  it("falls back to the full registry when every model is cooled down", () => {
    const now = Date.now();
    for (const model of CHAT_MODELS) {
      setModelCooldownUntil(model, now + 60_000);
    }
    expect(availableModels()).toEqual([...CHAT_MODELS]);
  });
});
