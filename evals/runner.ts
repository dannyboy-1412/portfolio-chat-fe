import OpenAI from "openai";
import { getSystemPrompt } from "@/server/ai/systemPrompt";
import type { TestCase, ConversationRun, ConversationTurnResult } from "./types";
import { readCache, writeCache } from "./cache";
import { sleep, withBackoff } from "./retry";

const CACHE_NAMESPACE = "responses";
const INTER_REQUEST_DELAY_MS = 1500;

function createClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Add it to .env or .env.local before running evals."
    );
  }
  return new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });
}

async function completeTurn(
  client: OpenAI,
  model: string,
  history: { role: "system" | "user" | "assistant"; content: string }[]
): Promise<ConversationTurnResult & { userContent: string }> {
  const userContent = history[history.length - 1].content;
  const startedAt = Date.now();

  const completion = await withBackoff(
    () =>
      client.chat.completions.create({
        model,
        messages: history,
        temperature: 0.2,
        stream: false,
      }),
    {
      onRetry: (attempt, error, delayMs) => {
        const status =
          error instanceof OpenAI.APIError ? error.status : "unknown";
        console.warn(
          `  [retry ${attempt}] ${model} status=${status} — waiting ${delayMs}ms`
        );
      },
    }
  );

  const assistant = completion.choices[0]?.message?.content ?? "";
  return {
    user: userContent,
    assistant,
    latencyMs: Date.now() - startedAt,
    userContent,
  };
}

export async function runTestCase(
  client: OpenAI,
  model: string,
  testCase: TestCase,
  useCache: boolean
): Promise<ConversationRun> {
  const cacheKey = `${model}__${testCase.id}`;

  if (useCache) {
    const cached = await readCache<ConversationRun>(CACHE_NAMESPACE, cacheKey);
    if (cached) {
      return cached;
    }
  }

  const history: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: getSystemPrompt() },
  ];
  const turns: ConversationTurnResult[] = [];
  let error: string | undefined;

  try {
    for (const userTurn of testCase.turns) {
      history.push({ role: "user", content: userTurn });
      const result = await completeTurn(client, model, history);
      history.push({ role: "assistant", content: result.assistant });
      turns.push({
        user: result.user,
        assistant: result.assistant,
        latencyMs: result.latencyMs,
      });
      await sleep(INTER_REQUEST_DELAY_MS);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  const run: ConversationRun = {
    testCaseId: testCase.id,
    model,
    turns,
    totalLatencyMs: turns.reduce((sum, t) => sum + t.latencyMs, 0),
    totalResponseChars: turns.reduce((sum, t) => sum + t.assistant.length, 0),
    ...(error ? { error } : {}),
  };

  await writeCache(CACHE_NAMESPACE, cacheKey, run);
  return run;
}

export async function runAll(
  testCases: TestCase[],
  models: string[],
  useCache: boolean
): Promise<ConversationRun[]> {
  const client = createClient();
  const runs: ConversationRun[] = [];
  const total = testCases.length * models.length;
  let completed = 0;

  for (const model of models) {
    for (const testCase of testCases) {
      completed += 1;
      const cached = useCache
        ? await readCache<ConversationRun>(
            CACHE_NAMESPACE,
            `${model}__${testCase.id}`
          )
        : undefined;
      console.log(
        `[${completed}/${total}]${cached ? " (cached)" : ""} ${model} — ${testCase.id}`
      );
      const run = cached ?? (await runTestCase(client, model, testCase, useCache));
      runs.push(run);
      if (run.error) {
        console.warn(`  error: ${run.error}`);
      }
    }
  }

  return runs;
}
