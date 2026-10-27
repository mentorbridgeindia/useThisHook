import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { EnvConfig, GrowthConfig } from './types.js';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function getPackageRoot(): string {
  return packageRoot;
}

export function loadGrowthConfig(
  configPath = resolve(packageRoot, 'growth.config.json'),
): GrowthConfig {
  const raw = JSON.parse(readFileSync(configPath, 'utf8')) as GrowthConfig;
  if (!raw.packageName || !raw.github?.owner || !raw.github?.repo)
    throw new Error('growth.config.json is missing required package or github fields');
  return raw;
}

export function loadEnvConfig(env: NodeJS.ProcessEnv = process.env): EnvConfig {
  const publish = env.GROWTH_PUBLISH === 'true';
  return {
    publish,
    githubToken: emptyToUndefined(env.GITHUB_TOKEN),
    gscServiceAccountJson: emptyToUndefined(env.GSC_SERVICE_ACCOUNT_JSON),
    gscSiteUrl: emptyToUndefined(env.GSC_SITE_URL),
    llmBaseUrl: emptyToUndefined(env.LLM_BASE_URL),
    llmModel: emptyToUndefined(env.LLM_MODEL),
    llmApiKey: emptyToUndefined(env.LLM_API_KEY),
    growthDataBranch: env.GROWTH_DATA_BRANCH?.trim() || 'growth-data',
  };
}

function emptyToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

export function resolveRepoPath(config: GrowthConfig, ...parts: string[]): string {
  return resolve(packageRoot, config.repoRootRelative, ...parts);
}

export function resolveGrowthPath(config: GrowthConfig, ...parts: string[]): string {
  return resolve(packageRoot, ...parts);
}
