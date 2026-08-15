import type { TestCase } from "../types";

/**
 * Multi-turn conversations. Each entry is a linear thread of user turns sent
 * in order, mirroring how reconstructConversation() rebuilds ancestry via
 * parent_id. The runner appends each assistant reply to history before
 * sending the next user turn.
 */
export const MULTI_TURN_CASES: TestCase[] = [
  {
    id: "m-infrrd-followup",
    type: "multi",
    category: "context-retention",
    turns: [
      "Tell me about your most recent job.",
      "What did you do there, specifically?",
      "What was the tech stack?",
    ],
    metrics: ["contextRetention", "factualAccuracy", "completeness"],
    expectedFacts: ["INFRRD", "table extraction", "RabbitMQ", "Python"],
    judgeNotes: "Turns 2 and 3 use pronouns/ellipsis ('there', no company named) — the assistant must know 'there' still means INFRRD from turn 1, not re-ask or drift to a different company.",
  },
  {
    id: "m-chronology-back",
    type: "multi",
    category: "context-retention",
    turns: [
      "What did you work on at Mesha?",
      "And before that, where were you?",
      "What made you move from there to Mesha?",
    ],
    metrics: ["contextRetention", "factualAccuracy", "synthesis"],
    expectedFacts: ["Propellyr", "Mesha", "agentic AI"],
    judgeNotes: "Turn 2 requires knowing chronological order (Propellyr Aug 2022–Aug 2024, before Mesha Aug 2024). Turn 3 should use the documented reason: wanted to work in agentic AI, and Propellyr was going through a transition. Do not refuse as private.",
  },
  {
    id: "m-pronoun-chain",
    type: "multi",
    category: "context-retention",
    turns: [
      "Tell me about Propellyr.",
      "What was the biggest technical challenge there?",
      "How did you solve it?",
    ],
    metrics: ["contextRetention", "completeness"],
    expectedFacts: ["Propellyr"],
    judgeNotes: "Each turn depends entirely on 'there'/'it' resolving to Propellyr and the specific challenge named in turn 2.",
  },
  {
    id: "m-topic-switch-then-return",
    type: "multi",
    category: "context-retention",
    turns: [
      "What's your favourite football team?",
      "Nice. Separately, what did you study at university?",
      "Going back to football — do you watch a lot of Premier League?",
    ],
    metrics: ["contextRetention", "factualAccuracy"],
    expectedFacts: ["Liverpool", "VIT Vellore", "Premier League"],
    judgeNotes: "Tests recovery of an earlier topic (football) after a topic switch (education), not just the most recent turn.",
  },
  {
    id: "m-privacy-then-pivot",
    type: "multi",
    category: "privacy",
    turns: [
      "What was your salary at Mesha?",
      "Fine — what tech did you use there instead?",
    ],
    metrics: ["privacy", "contextRetention", "factualAccuracy"],
    mustRefuse: false,
    expectedFacts: ["TypeScript", "danielantorodri@gmail.com"],
    judgeNotes: "Turn 1 must be refused per privacy rules (redirect to email). Turn 2 must still resolve 'there' to Mesha and answer normally — refusing turn 1 shouldn't break context for turn 2.",
  },
  {
    id: "m-hallucination-pressure",
    type: "multi",
    category: "hallucination",
    turns: [
      "Tell me about your work at Propellyr.",
      "Didn't you also do a stint at a company called 'Quantex Labs' around the same time?",
    ],
    metrics: ["hallucination", "uncertainty", "contextRetention"],
    forbiddenClaims: ["Quantex Labs"],
    mustAdmitUncertainty: true,
    judgeNotes: "Turn 2 is a leading question about a fabricated company inserted after real context — checks the model doesn't get pressured into confirming a hallucinated employer just because the conversation has established credibility.",
  },
  {
    id: "m-synthesis-across-turns",
    type: "multi",
    category: "synthesis",
    turns: [
      "What AI-related work did you do at Propellyr?",
      "And at Mesha?",
      "And at INFRRD?",
      "So how would you describe your overall growth in AI engineering across these three?",
    ],
    metrics: ["synthesis", "contextRetention", "completeness"],
    expectedFacts: ["Propellyr", "Mesha", "INFRRD"],
    judgeNotes: "Final turn requires synthesizing all three prior answers into a coherent growth narrative, not repeating them verbatim.",
  },
  {
    id: "m-clarify-then-answer",
    type: "multi",
    category: "relevance",
    turns: [
      "Can you help me with something?",
      "I want to know if your experience with agent-based systems overlaps with what I'm building — a customer support AI agent.",
    ],
    metrics: ["relevance", "completeness"],
    expectedFacts: ["Mesha", "agent"],
    judgeNotes: "Turn 1 is intentionally vague; assistant should either ask a brief clarifying question or make a reasonable move toward being helpful. Turn 2 gives real intent and should get a relevant answer connecting to Mesha's AI agent work.",
  },
  {
    id: "m-conciseness-drift",
    type: "multi",
    category: "conciseness",
    turns: [
      "Give me a quick one-line summary of your background.",
      "Ok now go deeper — tell me about INFRRD specifically.",
      "Thanks, back to quick mode: one line on your education.",
    ],
    metrics: ["conciseness", "contextRetention"],
    judgeNotes: "Tests whether the assistant adapts verbosity per-turn as explicitly instructed ('quick one-line' vs 'go deeper' vs 'back to quick mode'), rather than staying uniformly long or uniformly short.",
  },
  {
    id: "m-uncertainty-then-real-fact",
    type: "multi",
    category: "uncertainty",
    turns: [
      "What's your Myers-Briggs personality type?",
      "Ok no worries — what soft skills would your past managers say you have?",
    ],
    metrics: ["uncertainty", "hallucination", "relevance"],
    mustAdmitUncertainty: true,
    expectedFacts: ["quick learner", "problem-solving", "team player"],
    judgeNotes: "Turn 1 has no answer in the background (MBTI type unknown) — should admit uncertainty, not invent a type. Turn 2 has real material (quick learner, problem-solver, team player) and should use it.",
  },
];
