import { resolve } from 'node:path';
import type { HttpClient } from '../http.js';
import { getPackageRoot } from '../config.js';
import { recentTutorialHookIds, loadSnapshots } from '../metrics/history.js';
import type { ContentDraft, EnvConfig, GrowthConfig } from '../types.js';
import { loadCatalog, selectTutorialHook } from './catalog.js';
import { generateContentDraft } from './llm.js';

export async function createWeeklyContent(
  http: HttpClient,
  config: GrowthConfig,
  env: EnvConfig,
  dataDir: string,
  referenceDate = new Date(),
): Promise<ContentDraft> {
  const catalogPath = resolve(getPackageRoot(), config.catalogPath);
  const hooks = loadCatalog(catalogPath);
  const recent = recentTutorialHookIds(
    loadSnapshots(dataDir),
    config.content.recentTutorialLookback,
  );
  const hook = selectTutorialHook(hooks, recent, referenceDate);
  return generateContentDraft(http, hook, hooks, config, env);
}

export { loadCatalog, selectTutorialHook } from './catalog.js';
export { buildDeterministicDraft } from './deterministic.js';
export { validateContentDraft } from './validate.js';
export { generateContentDraft } from './llm.js';
