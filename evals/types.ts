export const METRICS = [
  "factualAccuracy",
  "completeness",
  "hallucination",
  "contextRetention",
  "relevance",
  "uncertainty",
  "privacy",
  "tone",
  "conciseness",
  "synthesis",
] as const;

export type MetricId = (typeof METRICS)[number];

export const METRIC_LABELS: Record<MetricId, string> = {
  factualAccuracy: "Factual accuracy",
  completeness: "Completeness",
  hallucination: "Hallucination (lower risk = higher score)",
  contextRetention: "Context retention",
  relevance: "Relevance",
  uncertainty: "Uncertainty admission",
  privacy: "Privacy",
  tone: "Tone",
  conciseness: "Conciseness",
  synthesis: "Synthesis",
};

export type TestCaseType = "single" | "multi" | "coverage";

export type TestCase = {
  id: string;
  type: TestCaseType;
  category: string;
  /** User turns sent in order; for "single"/"coverage" this has exactly one entry. */
  turns: string[];
  /** Metrics this case is designed to exercise; judge only scores these. */
  metrics: MetricId[];
  /** Facts that must appear (in substance) in the final answer. */
  expectedFacts?: string[];
  /** Claims the assistant must NOT make (hallucination traps). */
  forbiddenClaims?: string[];
  /** True if the correct behavior is a refusal / redirect (privacy). */
  mustRefuse?: boolean;
  /** True if the correct behavior is admitting uncertainty rather than inventing an answer. */
  mustAdmitUncertainty?: boolean;
  /** Extra instructions surfaced to the judge (why this case matters, what to look for). */
  judgeNotes?: string;
};

export type ConversationTurnResult = {
  user: string;
  assistant: string;
  latencyMs: number;
};

export type ConversationRun = {
  testCaseId: string;
  model: string;
  turns: ConversationTurnResult[];
  totalLatencyMs: number;
  totalResponseChars: number;
  error?: string;
};

export type JudgeScores = Partial<Record<MetricId, number>>;

export type JudgeResult = {
  testCaseId: string;
  model: string;
  scores: JudgeScores;
  rationale: string;
  hallucinated: boolean;
  privacyLeak: boolean;
  insufficientProfileInfo: boolean;
  infoGapNote?: string;
  error?: string;
};
