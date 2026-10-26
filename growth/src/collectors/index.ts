import type { HttpClient } from '../http.js';
import type {
  EnvConfig,
  GrowthConfig,
  SourceResult,
  GithubMetrics,
  GscMetrics,
  NpmMetrics,
} from '../types.js';
import { collectGithubMetrics } from './github.js';
import { collectGscMetrics } from './gsc.js';
import { collectNpmMetrics } from './npm.js';

export interface CollectedSources {
  npm: SourceResult<NpmMetrics>;
  github: SourceResult<GithubMetrics>;
  gsc: SourceResult<GscMetrics>;
}

export async function collectAllSources(
  http: HttpClient,
  config: GrowthConfig,
  env: EnvConfig,
  referenceDate = new Date(),
): Promise<CollectedSources> {
  const npm = await collectNpmMetrics(http, config.packageName, referenceDate);
  const github = await collectGithubMetrics(
    http,
    config.github.owner,
    config.github.repo,
    env.githubToken,
  );
  const gsc = await collectGscMetrics(
    http,
    env.gscServiceAccountJson,
    env.gscSiteUrl,
    referenceDate,
  );
  return { npm, github, gsc };
}

export { collectGithubMetrics, collectGscMetrics, collectNpmMetrics };
