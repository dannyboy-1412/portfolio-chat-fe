import { mkdir, writeFile } from "fs/promises";
import path from "path";
import {
  METRICS,
  METRIC_LABELS,
  type MetricId,
  type TestCase,
  type ConversationRun,
  type JudgeResult,
} from "./types";

const REPORTS_DIR = path.resolve(process.cwd(), "evals/reports");

type ModelStats = {
  model: string;
  metricAverages: Partial<Record<MetricId, number>>;
  overallAverage: number | null;
  hallucinationCount: number;
  privacyLeakCount: number;
  errorCount: number;
  avgLatencyMs: number;
  avgResponseChars: number;
  casesGraded: number;
};

/**
 * Known drift between the LLM-facing system prompt and the UI-facing
 * profile content, spotted during codebase review rather than by the judge.
 */
const KNOWN_PROFILE_DISCREPANCIES: string[] = [];

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function computeModelStats(
  model: string,
  judgeResults: JudgeResult[],
  runs: ConversationRun[]
): ModelStats {
  const modelJudged = judgeResults.filter((r) => r.model === model && !r.error);
  const modelRuns = runs.filter((r) => r.model === model);

  const metricAverages: Partial<Record<MetricId, number>> = {};
  for (const metric of METRICS) {
    const values = modelJudged
      .map((r) => r.scores[metric])
      .filter((v): v is number => typeof v === "number");
    const avg = average(values);
    if (avg !== null) metricAverages[metric] = avg;
  }

  const allScores = modelJudged.flatMap((r) => Object.values(r.scores)) as number[];

  const latencies = modelRuns.flatMap((r) => r.turns.map((t) => t.latencyMs));
  const chars = modelRuns.map((r) => r.totalResponseChars).filter((c) => c > 0);

  return {
    model,
    metricAverages,
    overallAverage: average(allScores),
    hallucinationCount: judgeResults.filter((r) => r.model === model && r.hallucinated).length,
    privacyLeakCount: judgeResults.filter((r) => r.model === model && r.privacyLeak).length,
    errorCount: runs.filter((r) => r.model === model && r.error).length,
    avgLatencyMs: average(latencies) ?? 0,
    avgResponseChars: average(chars) ?? 0,
    casesGraded: modelJudged.length,
  };
}

function fmt(n: number | null | undefined, digits = 2): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toFixed(digits);
}

function renderLeaderboard(stats: ModelStats[]): string {
  const sorted = [...stats].sort(
    (a, b) => (b.overallAverage ?? 0) - (a.overallAverage ?? 0)
  );

  const header =
    "| Model | Overall (1-5) | Hallucinations | Privacy Leaks | Errors | Avg Latency (ms) | Avg Response (chars) |";
  const divider = "|---|---|---|---|---|---|---|";
  const rows = sorted.map(
    (s) =>
      `| ${s.model} | ${fmt(s.overallAverage)} | ${s.hallucinationCount} | ${s.privacyLeakCount} | ${s.errorCount} | ${fmt(s.avgLatencyMs, 0)} | ${fmt(s.avgResponseChars, 0)} |`
  );

  return [header, divider, ...rows].join("\n");
}

function renderPerMetricTable(stats: ModelStats[]): string {
  const header = `| Metric | ${stats.map((s) => s.model).join(" | ")} |`;
  const divider = `|---|${stats.map(() => "---").join("|")}|`;
  const rows = METRICS.map((metric) => {
    const cells = stats.map((s) => fmt(s.metricAverages[metric]));
    return `| ${METRIC_LABELS[metric]} | ${cells.join(" | ")} |`;
  });
  return [header, divider, ...rows].join("\n");
}

function pickBestModel(stats: ModelStats[]): ModelStats | undefined {
  return [...stats].sort((a, b) => {
    const aPenalty = a.hallucinationCount + a.privacyLeakCount;
    const bPenalty = b.hallucinationCount + b.privacyLeakCount;
    const aScore = (a.overallAverage ?? 0) - aPenalty * 0.1;
    const bScore = (b.overallAverage ?? 0) - bPenalty * 0.1;
    return bScore - aScore;
  })[0];
}

function renderInfoGapSection(
  testCases: TestCase[],
  judgeResults: JudgeResult[]
): string {
  const testCaseById = new Map(testCases.map((tc) => [tc.id, tc]));
  const flagged = judgeResults.filter((r) => r.insufficientProfileInfo);

  const byTestCase = new Map<string, { note: string; models: Set<string> }>();
  for (const result of flagged) {
    const existing = byTestCase.get(result.testCaseId);
    const note = result.infoGapNote ?? "No specific note provided by judge.";
    if (existing) {
      existing.models.add(result.model);
    } else {
      byTestCase.set(result.testCaseId, { note, models: new Set([result.model]) });
    }
  }

  const byCategory = new Map<string, { testCaseId: string; question: string; note: string; models: string[] }[]>();
  for (const [testCaseId, { note, models }] of byTestCase) {
    const testCase = testCaseById.get(testCaseId);
    const category = testCase?.category ?? "uncategorized";
    const list = byCategory.get(category) ?? [];
    list.push({
      testCaseId,
      question: testCase?.turns[testCase.turns.length - 1] ?? "(unknown question)",
      note,
      models: [...models],
    });
    byCategory.set(category, list);
  }

  const sections: string[] = [];
  for (const [category, items] of byCategory) {
    sections.push(`### ${category}\n`);
    for (const item of items) {
      sections.push(
        `- **"${item.question}"** — ${item.note} _(flagged by: ${item.models.join(", ")})_`
      );
    }
    sections.push("");
  }

  if (sections.length === 0) {
    sections.push("No gaps were flagged by the judge across the test set.");
  }

  return sections.join("\n");
}

const UX_RECOMMENDATIONS = `
1. **Voice input** — add a mic button next to the chat input using the browser's Web Speech API (\`SpeechRecognition\`) for free, zero-latency transcription in supported browsers (Chrome/Edge), with a graceful fallback to typing elsewhere (e.g. Safari/Firefox have inconsistent support). For higher accuracy across all browsers, a small server route that forwards audio to OpenRouter/Whisper would be a more robust v2.
2. **Suggested follow-up chips** — after each assistant answer, surface 2-3 contextual follow-up questions (e.g. after an INFRRD answer, suggest "What was the biggest technical challenge?"). This nudges visitors past generic questions and directly improves the "relevance" and "completeness" metrics by steering toward material the profile actually covers well.
3. **Response length control** — a lightweight toggle ("Brief" / "Detailed") would directly address the conciseness metric and let recruiters skim while letting curious visitors go deep, without the model having to guess intent from phrasing alone.
4. **Thumbs up/down feedback** — a simple reaction on each assistant message, logged server-side, turns real visitor traffic into an ongoing eval signal instead of relying solely on manual or scripted testing.
5. **Extend the 30-minute TTL for returning visitors** — currently threads expire quickly; a "resume conversation" affordance (e.g. persisted in \`localStorage\` with a longer server TTL) would help visitors who read the site, leave, and come back with a follow-up.
6. **Close the coverage gaps surfaced below before adding more UX polish** — several coverage-probe questions (visa status, availability, notice period) are exactly what a recruiter asks first; fixing profile content will likely move the quality metrics more than any UI feature.
`.trim();

export function generateReport(
  testCases: TestCase[],
  runs: ConversationRun[],
  judgeResults: JudgeResult[],
  models: string[]
): string {
  const stats = models.map((m) => computeModelStats(m, judgeResults, runs));
  const best = pickBestModel(stats);
  const generatedAt = new Date().toISOString();

  const totalCases = testCases.length;
  const totalConversationTurns = runs.reduce((sum, r) => sum + r.turns.length, 0);

  return `# Chatbot Evaluation Report

Generated: ${generatedAt}
Test cases: ${totalCases} (single-turn, multi-turn, coverage probes) across ${models.length} models — ${totalConversationTurns} total conversation turns graded by \`anthropic/claude-sonnet-4.5\` as judge.

## 1. Information to add to the profile

These gaps were flagged by the judge because the system prompt genuinely lacks material a visitor would reasonably ask for, or were spotted directly in the source files.

${renderInfoGapSection(testCases, judgeResults)}

### Known discrepancies between \`profile.ts\` and \`systemPrompt.ts\`

${
  KNOWN_PROFILE_DISCREPANCIES.length > 0
    ? KNOWN_PROFILE_DISCREPANCIES.map((d) => `- ${d}`).join("\n")
    : "None currently tracked."
}

## 2. Which model answers best

### Leaderboard

${renderLeaderboard(stats)}

### Per-metric averages (1-5, higher is better; hallucination = lower risk is higher score)

${renderPerMetricTable(stats)}

### Recommendation

${
  best
    ? `**${best.model}** comes out on top with an overall average of ${fmt(best.overallAverage)}/5 across ${best.casesGraded} graded cases, ${best.hallucinationCount} flagged hallucination(s), and ${best.privacyLeakCount} privacy leak(s). ${
        best.hallucinationCount === 0 && best.privacyLeakCount === 0
          ? "It had zero hallucination or privacy incidents, which matters more than a marginal score difference for a bot that represents you publicly."
          : "It still had some hallucination/privacy incidents — review the flagged transcripts before treating it as production-safe, and consider tightening the system prompt's refusal/uncertainty instructions regardless of which model you pick."
      } Consider keeping it as \`primaryModel()\` in \`src/server/ai/modelRotation.ts\` and reordering the remaining fallbacks by their overall averages above.`
    : "No model produced enough graded results to make a recommendation — check for run/judge errors above."
}

## 3. Opinions on improving the experience

${UX_RECOMMENDATIONS}
`;
}

export async function writeReport(content: string): Promise<string> {
  await mkdir(REPORTS_DIR, { recursive: true });
  const filename = `${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}-report.md`;
  const filePath = path.join(REPORTS_DIR, filename);
  await writeFile(filePath, content, "utf-8");
  return filePath;
}
