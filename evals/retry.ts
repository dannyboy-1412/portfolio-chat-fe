export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
};

function isRetryableStatus(status: number | undefined): boolean {
  return status === 429 || status === 402 || (status !== undefined && status >= 500);
}

function extractStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

/**
 * Retries a rate-limit/5xx-prone call with exponential backoff, keeping
 * attribution to the same model (unlike production's cross-model fallback).
 */
export async function withBackoff<T>(
  fn: () => Promise<T>,
  { maxAttempts = 5, baseDelayMs = 2000, onRetry }: RetryOptions = {}
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      const status = extractStatus(error);
      const retryable = isRetryableStatus(status);
      if (!retryable || attempt >= maxAttempts) {
        throw error;
      }
      const delayMs = baseDelayMs * 2 ** (attempt - 1);
      onRetry?.(attempt, error, delayMs);
      await sleep(delayMs);
    }
  }
}
