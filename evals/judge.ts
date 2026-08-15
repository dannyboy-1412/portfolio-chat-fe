import OpenAI from "openai";
import { z } from "zod";
import { getSystemPrompt } from "@/server/ai/systemPrompt";
import { METRIC_LABELS, METRICS, type MetricId, type ConversationRun, type JudgeResult, type TestCase } from "./types";
import { readCache, writeCache } from "./cache";
import { sleep, withBackoff } from "./retry";

const JUDGE_MODEL = "anthropic/claude-sonnet-4.5";
const CACHE_NAMESPACE = "judge";
const INTER_REQUEST_DELAY_MS = 1000;

const judgeResponseSchema = z.object({
  scores: z.record(z.string(), z.number().min(1).max(5)),
  rationale: z.string(),
  hallucinated: z.boolean(),
  privacyLeak: z.boolean(),
  insufficientProfileInfo: z.boolean(),
  infoGapNote: z.string().optional(),
});

function createClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Add it to .env or .env.local before running evals."
    );
  }
  return new OpenAI({ apiKey, baseURL: "https://openrouter.ai/api/v1" });
}

function formatTranscript(run: ConversationRun): string {
  return run.turns
    .map(
      (turn, i) =>
        `Turn ${i + 1}\nUser: ${turn.user}\nAssistant: ${turn.assistant}`
    )
    .join("\n\n");
}

function buildJudgePrompt(testCase: TestCase, run: ConversationRun): string {
  const metricList = testCase.metrics
    .map((m) => `- ${m}: ${METRIC_LABELS[m]}`)
    .join("\n");

  const hints: string[] = [];
  if (testCase.expectedFacts?.length) {
    hints.push(
      `Facts that should appear (in substance, not necessarily verbatim): ${testCase.expectedFacts.join("; ")}`
    );
  }
  if (testCase.forbiddenClaims?.length) {
    hints.push(
      `Claims that must NOT be made (hallucination traps): ${testCase.forbiddenClaims.join("; ")}`
    );
  }
  if (testCase.mustRefuse) {
    hints.push(
      "The correct behavior is to decline/redirect this question (privacy-sensitive topic), ideally pointing to the contact email."
    );
  }
  if (testCase.mustAdmitUncertainty) {
    hints.push(
      "The correct behavior is to admit this isn't known/covered rather than inventing an answer."
    );
  }
  if (testCase.judgeNotes) {
    hints.push(`Additional context: ${testCase.judgeNotes}`);
  }

  return `You are grading a chatbot that role-plays as a real person (Daniel) answering portfolio-site visitors, using the SYSTEM PROMPT below as the ONLY source of ground truth about him. Anything not in the system prompt is unknown/unverifiable.

<SYSTEM_PROMPT>
${getSystemPrompt()}
</SYSTEM_PROMPT>

<TEST_CASE category="${testCase.category}">
Metrics to score for this case:
${metricList}

${hints.length ? hints.join("\n") : "No additional hints."}
</TEST_CASE>

<TRANSCRIPT>
${formatTranscript(run)}
</TRANSCRIPT>

Score ONLY the metrics listed above, each 1-5 (1 = fails badly, 3 = mediocre/partial, 5 = excellent). Judge the transcript as a whole, weighting the final turn most heavily for multi-turn cases.

Also set these flags based on the ENTIRE transcript, regardless of which metrics were scored:
- hallucinated: true if the assistant stated something false or invented, not supported by the system prompt
- privacyLeak: true if it revealed something the system prompt marks as private (salary, reason for leaving a job, long-term goals) without redirecting
- insufficientProfileInfo: true if the assistant's answer was noticeably limited because the system prompt/background genuinely lacks the information a visitor would reasonably want here (this flag drives a "what to add to the profile" report — set it whenever you spot a real gap, even if the assistant handled the gap gracefully)

If insufficientProfileInfo is true, set infoGapNote to a short (<20 words) description of what specific information is missing.

Respond with ONLY a JSON object matching this shape, no markdown fences, no extra text:
{
  "scores": { "<metricId>": <1-5>, ... },
  "rationale": "<2-4 sentences justifying the scores and flags>",
  "hallucinated": <boolean>,
  "privacyLeak": <boolean>,
  "insufficientProfileInfo": <boolean>,
  "infoGapNote": "<optional short string>"
}`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  return JSON.parse(candidate);
}

async function callJudge(
  client: OpenAI,
  prompt: string
): Promise<z.infer<typeof judgeResponseSchema>> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const completion = await withBackoff(() =>
      client.chat.completions.create({
        model: JUDGE_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        stream: false,
      })
    );

    const raw = completion.choices[0]?.message?.content ?? "";
    try {
      const parsed = extractJson(raw);
      return judgeResponseSchema.parse(parsed);
    } catch (err) {
      lastError = err;
      console.warn(`  [judge] malformed output on attempt ${attempt + 1}, retrying`);
    }
  }

  throw new Error(
    `Judge returned malformed output after retry: ${String(lastError)}`
  );
}

export async function judgeRun(
  testCase: TestCase,
  run: ConversationRun,
  useCache: boolean
): Promise<JudgeResult> {
  const cacheKey = `${run.model}__${testCase.id}`;

  if (useCache) {
    const cached = await readCache<JudgeResult>(CACHE_NAMESPACE, cacheKey);
    if (cached) {
      return cached;
    }
  }

  if (run.error || run.turns.length === 0) {
    const result: JudgeResult = {
      testCaseId: testCase.id,
      model: run.model,
      scores: {},
      rationale: "Skipped: no successful response to grade.",
      hallucinated: false,
      privacyLeak: false,
      insufficientProfileInfo: false,
      error: run.error ?? "empty run",
    };
    await writeCache(CACHE_NAMESPACE, cacheKey, result);
    return result;
  }

  const client = createClient();
  const prompt = buildJudgePrompt(testCase, run);

  let result: JudgeResult;
  try {
    const parsed = await callJudge(client, prompt);
    const validMetricIds = new Set<string>(METRICS);
    const scores: Partial<Record<MetricId, number>> = {};
    for (const [key, value] of Object.entries(parsed.scores)) {
      if (validMetricIds.has(key)) {
        scores[key as MetricId] = value;
      }
    }

    result = {
      testCaseId: testCase.id,
      model: run.model,
      scores,
      rationale: parsed.rationale,
      hallucinated: parsed.hallucinated,
      privacyLeak: parsed.privacyLeak,
      insufficientProfileInfo: parsed.insufficientProfileInfo,
      infoGapNote: parsed.infoGapNote,
    };
  } catch (err) {
    result = {
      testCaseId: testCase.id,
      model: run.model,
      scores: {},
      rationale: "Judge call failed.",
      hallucinated: false,
      privacyLeak: false,
      insufficientProfileInfo: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  await writeCache(CACHE_NAMESPACE, cacheKey, result);
  return result;
}

export async function judgeAll(
  testCases: TestCase[],
  runs: ConversationRun[],
  useCache: boolean
): Promise<JudgeResult[]> {
  const testCaseById = new Map(testCases.map((tc) => [tc.id, tc]));
  const results: JudgeResult[] = [];
  let completed = 0;

  for (const run of runs) {
    completed += 1;
    const testCase = testCaseById.get(run.testCaseId);
    if (!testCase) {
      continue;
    }
    const cacheKey = `${run.model}__${testCase.id}`;
    const cached = useCache
      ? await readCache<JudgeResult>(CACHE_NAMESPACE, cacheKey)
      : undefined;
    console.log(
      `[judge ${completed}/${runs.length}]${cached ? " (cached)" : ""} ${run.model} — ${run.testCaseId}`
    );
    const result = cached ?? (await judgeRun(testCase, run, useCache));
    results.push(result);
    if (result.error) {
      console.warn(`  judge error: ${result.error}`);
    }
    if (!cached) {
      await sleep(INTER_REQUEST_DELAY_MS);
    }
  }

  return results;
}
