import { readFileSync } from 'node:fs';
import { isoWeekNumber } from '../dates.js';
import type { HookCatalogEntry, HookCatalogFile } from '../types.js';

export function loadCatalog(catalogPath: string): HookCatalogEntry[] {
  const file = JSON.parse(readFileSync(catalogPath, 'utf8')) as HookCatalogFile;
  if (!Array.isArray(file.hooks) || file.hooks.length === 0)
    throw new Error(`Catalog at ${catalogPath} has no hooks`);
  return file.hooks;
}

export function selectTutorialHook(
  hooks: HookCatalogEntry[],
  recentHookIds: string[],
  referenceDate = new Date(),
): HookCatalogEntry {
  const recent = new Set(recentHookIds);
  const unused = hooks.filter((hook) => !recent.has(hook.id));
  const pool = unused.length > 0 ? unused : hooks;
  const index = isoWeekNumber(referenceDate) % pool.length;
  const selected = pool[index];
  if (!selected) throw new Error('Unable to select a tutorial hook from catalog');
  return selected;
}

export function catalogHookNames(hooks: HookCatalogEntry[]): Set<string> {
  return new Set(hooks.map((hook) => hook.name));
}
