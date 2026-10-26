import type { ContentDraft, HookCatalogEntry } from '../types.js';

export interface ValidationResult {
  ok: boolean;
  reasons: string[];
}

export function validateContentDraft(
  draft: ContentDraft,
  hooks: HookCatalogEntry[],
): ValidationResult {
  const reasons: string[] = [];
  const byName = new Map(hooks.map((hook) => [hook.name, hook]));
  const hook = byName.get(draft.hookName);

  if (!hook) reasons.push(`Unknown hook name: ${draft.hookName}`);
  if (draft.hookId && hook && draft.hookId !== hook.id)
    reasons.push(`hookId ${draft.hookId} does not match catalog id ${hook.id}`);
  if (hook && draft.playgroundUrl !== hook.playgroundUrl)
    reasons.push('playgroundUrl does not match catalog');
  if (!draft.example.trim()) reasons.push('example is empty');
  if (!draft.installCommand.includes('usethishook'))
    reasons.push('installCommand must reference usethishook');

  const mentioned = extractHookMentions(
    `${draft.title}\n${draft.communityDraft}\n${draft.linkedInDraft}`,
  );
  for (const name of mentioned) {
    if (!byName.has(name)) reasons.push(`Invented or unknown hook mention: ${name}`);
  }

  return { ok: reasons.length === 0, reasons };
}

const HOOK_NAME = /\buse[A-Z][A-Za-z0-9]+\b/g;

function extractHookMentions(text: string): string[] {
  return [...new Set(text.match(HOOK_NAME) ?? [])];
}
