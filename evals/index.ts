import "dotenv/config";
import { getAllTestCases } from "./dataset";
import { CHAT_MODELS } from "@/server/ai/modelRotation";
import { runAll } from "./runner";
import { judgeAll } from "./judge";
import { generateReport, writeReport } from "./report";

type CliOptions = {
  models: string[];
  sample?: number;
  fresh: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { models: [...CHAT_MODELS], fresh: false };

  for (const arg of argv) {
    if (arg.startsWith("--models=")) {
      options.models = arg
        .slice("--models=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (arg.startsWith("--sample=")) {
      options.sample = Number(arg.slice("--sample=".length));
    } else if (arg === "--fresh") {
      options.fresh = true;
    }
  }

  return options;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const useCache = !options.fresh;

  let testCases = getAllTestCases();
  if (options.sample && options.sample > 0) {
    testCases = testCases.slice(0, options.sample);
  }

  console.log(
    `Running ${testCases.length} test case(s) x ${options.models.length} model(s) (cache ${useCache ? "on" : "off"})`
  );
  console.log(`Models: ${options.models.join(", ")}`);

  const runs = await runAll(testCases, options.models, useCache);
  console.log(`\nCompleted ${runs.length} conversation run(s). Judging...\n`);

  const judgeResults = await judgeAll(testCases, runs, useCache);
  console.log(`\nCompleted ${judgeResults.length} judge result(s). Generating report...\n`);

  const report = generateReport(testCases, runs, judgeResults, options.models);
  const reportPath = await writeReport(report);

  console.log(`Report written to ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
