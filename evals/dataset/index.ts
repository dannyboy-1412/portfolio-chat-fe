import type { TestCase } from "../types";
import { SINGLE_TURN_CASES } from "./singleTurn";
import { MULTI_TURN_CASES } from "./multiTurn";
import { COVERAGE_PROBE_CASES } from "./coverageProbes";

export function getAllTestCases(): TestCase[] {
  return [...SINGLE_TURN_CASES, ...MULTI_TURN_CASES, ...COVERAGE_PROBE_CASES];
}

export { SINGLE_TURN_CASES, MULTI_TURN_CASES, COVERAGE_PROBE_CASES };
