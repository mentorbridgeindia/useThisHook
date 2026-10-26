import { resolve } from 'node:path';
import { prioritizeActions } from './analysis/prioritize.js';
import { auditDocumentation } from './audit/docs.js';
import { collectAllSources } from './collectors/index.js';
import { getPackageRoot, loadEnvConfig, loadGrowthConfig } from './config.js';
import { createWeeklyContent } from './content/index.js';
import { HttpClient } from './http.js';
import { compareWithHistory } from './metrics/compare.js';
import { latestSnapshot } from './metrics/history.js';
import { normalizeSnapshot } from './metrics/normalize.js';
import { safeLog, safeWarn } from './redact.js';
import { renderGrowthReport } from './report/markdown.js';
import { publishGithubIssue, writeReportFiles } from './report/publish.js';
import type { GrowthReport } from './types.js';

export interface PipelineResult {
  report: GrowthReport;
  reportPath: string;
  snapshotPath: string;
  exitCode: number;
}

export async function runGrowthPipeline(
  options: { referenceDate?: Date } = {},
): Promise<PipelineResult> {
  const config = loadGrowthConfig();
  const env = loadEnvConfig();
  const secrets = [env.githubToken, env.llmApiKey, env.gscServiceAccountJson].filter(
    (value): value is string => Boolean(value),
  );
  const http = new HttpClient({
    maxRequests: config.limits.maxHttpRequests,
    timeoutMs: config.limits.requestTimeoutMs,
    maxRetries: config.limits.maxRetries,
    minGithubRateLimitRemaining: config.limits.minGithubRateLimitRemaining,
    secretsToRedact: secrets,
  });

  const referenceDate = options.referenceDate ?? new Date();
  const packageRoot = getPackageRoot();
  const dataDir = resolve(packageRoot, config.dataDir);
  const reportsDir = resolve(packageRoot, config.reportsDir);

  safeLog('Collecting growth sources…', secrets);
  const sources = await collectAllSources(http, config, env, referenceDate);
  const snapshot = normalizeSnapshot(sources, config.packageName, referenceDate.toISOString());
  const previous = latestSnapshot(dataDir);
  const comparisons = compareWithHistory(snapshot, previous);
  const audit = auditDocumentation(config);
  const content = await createWeeklyContent(http, config, env, dataDir, referenceDate);
  snapshot.tutorialHookId = content.hookId;

  const actions = prioritizeActions(snapshot, comparisons, audit);
  const limitations = buildLimitations(snapshot, env);
  const date = snapshot.collectedAt.slice(0, 10);
  const markdown = renderGrowthReport({
    date,
    snapshot,
    comparisons,
    actions,
    content,
    audit,
    limitations,
  });

  const report: GrowthReport = {
    date,
    snapshot,
    comparisons,
    actions,
    content,
    audit,
    limitations,
    markdown,
  };

  const { reportPath, snapshotPath } = writeReportFiles(config, report, reportsDir, dataDir);
  safeLog(`Wrote report ${reportPath}`, secrets);
  safeLog(`Wrote snapshot ${snapshotPath}`, secrets);

  const publishResult = await publishGithubIssue(http, config, env, report);
  if (publishResult.created) safeLog(`Published issue ${publishResult.url}`, secrets);
  else safeLog(`Issue publish skipped: ${publishResult.skippedReason}`, secrets);

  if (config.pullRequests.enabled)
    safeWarn(
      'pullRequests.enabled is true, but automatic PR creation remains disabled in MVP.',
      secrets,
    );

  const requiredOk = sources.npm.status === 'ok' || sources.github.status === 'ok';
  if (!requiredOk) {
    safeWarn('Both required public sources failed.', secrets);
    return { report, reportPath, snapshotPath, exitCode: 1 };
  }

  safeLog(`Growth run complete. HTTP requests used: ${http.getRequestCount()}`, secrets);
  return { report, reportPath, snapshotPath, exitCode: 0 };
}

function buildLimitations(
  snapshot: ReturnType<typeof normalizeSnapshot>,
  env: ReturnType<typeof loadEnvConfig>,
): string[] {
  const limitations = [
    'Observed metrics are not causal proof of adoption changes.',
    'Optional sources may be unavailable without failing the run.',
    'Content drafts are for human review and are never auto-posted.',
  ];
  if (snapshot.sources.gsc !== 'ok')
    limitations.push('Google Search Console was not collected in this run.');
  if (!env.llmApiKey) limitations.push('LLM provider not configured; deterministic drafts used.');
  if (snapshot.github?.trafficUnavailableReason)
    limitations.push(`GitHub traffic unavailable: ${snapshot.github.trafficUnavailableReason}`);
  return limitations;
}
