import { loadCatalog } from './catalog.js';
import type { HookDoc } from './types.js';

interface RankedHook {
  hook: HookDoc;
  score: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

function scoreHook(hook: HookDoc, query: string): number {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return 0;

  let score = 0;
  const haystacks: Array<{ text: string; weight: number }> = [
    { text: hook.id.toLowerCase(), weight: 12 },
    { text: hook.name.toLowerCase(), weight: 12 },
    { text: hook.summary.toLowerCase(), weight: 6 },
    { text: hook.whenToUse.toLowerCase(), weight: 5 },
    { text: hook.description.toLowerCase(), weight: 3 },
    { text: hook.api.signature.toLowerCase(), weight: 2 },
    { text: hook.api.explanation.toLowerCase(), weight: 2 },
    { text: hook.category.toLowerCase(), weight: 1 },
    { text: (hook.tags ?? []).join(' ').toLowerCase(), weight: 2 },
  ];

  for (const { text, weight } of haystacks) {
    if (text === normalized) score += weight * 4;
    else if (text.includes(normalized)) score += weight * 2;
  }

  const tokens = tokenize(normalized);
  for (const token of tokens) {
    for (const { text, weight } of haystacks) {
      if (text.includes(token)) score += weight;
    }
    // Prefer the exact hook over longer siblings (useDebounce vs useDebouncedCallback).
    const bareName = hook.id.toLowerCase().replace(/^use/, '');
    if (token === bareName || normalized === hook.id.toLowerCase()) score += 20;
  }

  return score;
}

export function searchHooks(query: string, limit = 8): HookDoc[] {
  const capped = Math.min(Math.max(limit, 1), 33);
  const ranked: RankedHook[] = loadCatalog()
    .map((hook) => ({ hook, score: scoreHook(hook, query) }))
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.hook.name.length - b.hook.name.length ||
        a.hook.name.localeCompare(b.hook.name),
    );

  return ranked.slice(0, capped).map((item) => item.hook);
}

export function recommendHooks(task: string, limit = 5): HookDoc[] {
  return searchHooks(task, limit);
}
