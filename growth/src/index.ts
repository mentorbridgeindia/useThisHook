import { runGrowthPipeline } from './pipeline.js';
import { safeWarn } from './redact.js';

export { runGrowthPipeline } from './pipeline.js';
export { loadGrowthConfig, loadEnvConfig } from './config.js';
export { collectNpmMetrics, collectGithubMetrics, collectGscMetrics } from './collectors/index.js';
export { normalizeSnapshot } from './metrics/normalize.js';
export { comparePeriods, compareWithHistory } from './metrics/compare.js';
export { prioritizeActions } from './analysis/prioritize.js';
export { buildDeterministicDraft, validateContentDraft } from './content/index.js';
export { auditDocumentation } from './audit/docs.js';
export { renderGrowthReport } from './report/markdown.js';

async function main(): Promise<void> {
  const result = await runGrowthPipeline();
  process.exitCode = result.exitCode;
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('/index.js') ||
    process.argv[1].endsWith('/index.ts') ||
    process.argv[1].endsWith('usethishook-growth'));

if (isDirectRun) {
  try {
    await main();
  } catch (error) {
    safeWarn(error instanceof Error ? (error.stack ?? error.message) : String(error));
    process.exitCode = 1;
  }
}
