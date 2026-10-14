import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { HookCatalogFile, HookCategory, HookDoc, HookListItem } from './types.js';

const catalogPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'catalog.json');

let cachedCatalog: HookDoc[] | undefined;

export function loadCatalog(): HookDoc[] {
  if (cachedCatalog) return cachedCatalog;
  const raw = JSON.parse(readFileSync(catalogPath, 'utf8')) as HookCatalogFile;
  if (!Array.isArray(raw.hooks) || raw.hooks.length === 0) {
    throw new Error('MCP catalog is empty or invalid. Run npm run mcp:catalog from the repo root.');
  }
  cachedCatalog = raw.hooks;
  return cachedCatalog;
}

/** Test helper — swap catalog without touching disk. */
export function setCatalogForTests(hooks: HookDoc[] | undefined): void {
  cachedCatalog = hooks;
}

export function listHooks(category?: HookCategory): HookListItem[] {
  return loadCatalog()
    .filter((hook) => (category ? hook.category === category : true))
    .map((hook) => ({
      id: hook.id,
      name: hook.name,
      summary: hook.summary,
      category: hook.category,
      ...(hook.tags ? { tags: hook.tags } : {}),
      whenToUse: hook.whenToUse,
      playgroundUrl: hook.playgroundUrl,
    }));
}

export function getHook(idOrName: string): HookDoc | undefined {
  const needle = idOrName.trim().toLowerCase();
  if (!needle) return undefined;
  return loadCatalog().find(
    (hook) => hook.id.toLowerCase() === needle || hook.name.toLowerCase() === needle,
  );
}

export function formatHookMarkdown(hook: HookDoc): string {
  const args =
    hook.api.arguments.length === 0
      ? '_None_'
      : hook.api.arguments
          .map((field) => {
            const optional = field.optional ? ' (optional)' : '';
            const defaultValue =
              field.defaultValue !== undefined ? ` — default \`${field.defaultValue}\`` : '';
            return `- \`${field.name}\`: \`${field.type}\`${optional}${defaultValue} — ${field.description}`;
          })
          .join('\n');

  const returnFieldLines =
    hook.api.returns.fields && hook.api.returns.fields.length > 0
      ? [
          '',
          'Return fields:',
          ...hook.api.returns.fields.map(
            (field) => `- \`${field.name}\`: \`${field.type}\` — ${field.description}`,
          ),
        ]
      : [];

  const caveatLines =
    hook.api.caveats && hook.api.caveats.length > 0
      ? ['', 'Caveats:', ...hook.api.caveats.map((item) => `- ${item}`)]
      : [];

  return [
    `# ${hook.name}`,
    '',
    hook.summary,
    '',
    `**Category:** ${hook.category}`,
    ...(hook.tags && hook.tags.length > 0 ? [`**Tags:** ${hook.tags.join(', ')}`] : []),
    `**When to use:** ${hook.whenToUse}`,
    `**Playground:** ${hook.playgroundUrl}`,
    '',
    '## Description',
    '',
    hook.description,
    '',
    '## Import',
    '',
    '```ts',
    hook.import,
    '```',
    '',
    '## API',
    '',
    `\`${hook.api.signature}\``,
    '',
    hook.api.explanation,
    '',
    '### Arguments',
    '',
    args,
    '',
    '### Returns',
    '',
    `\`${hook.api.returns.type}\` — ${hook.api.returns.description}`,
    ...returnFieldLines,
    ...caveatLines,
    '',
    '## Example',
    '',
    '```tsx',
    hook.example,
    '```',
  ].join('\n');
}
