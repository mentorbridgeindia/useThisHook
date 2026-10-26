import type { ContentDraft, GrowthConfig, HookCatalogEntry } from '../types.js';

export function buildDeterministicDraft(
  hook: HookCatalogEntry,
  config: GrowthConfig,
): ContentDraft {
  const title = `${hook.name}: ${trimSentence(hook.whenToUse)}`;
  const outline = [
    `Problem: ${trimSentence(hook.whenToUse)}`,
    `Install: \`${config.content.installCommand}\``,
    `API: \`${hook.api.signature}\``,
    'Walk through a minimal runnable example',
    `Link the live demo at ${hook.playgroundUrl}`,
    'Call out SSR / edge caveats from the docs if relevant',
  ];

  const linkedInDraft = [
    `${hook.name} solves a common React pain: ${trimSentence(hook.summary)}`,
    '',
    `Install: ${config.content.installCommand}`,
    `Docs: ${hook.playgroundUrl}`,
    '',
    'Draft only — review before posting. No automated publishing.',
  ].join('\n');

  const communityDraft = [
    `## ${title}`,
    '',
    hook.description.trim(),
    '',
    '### Install',
    '```bash',
    config.content.installCommand,
    '```',
    '',
    '### Example',
    '```tsx',
    hook.example.trim(),
    '```',
    '',
    `Live demo: ${hook.playgroundUrl}`,
    '',
    '_Human review required before posting to DEV, Reddit, or elsewhere._',
  ].join('\n');

  return {
    hookId: hook.id,
    hookName: hook.name,
    title,
    outline,
    example: hook.example.trim(),
    playgroundUrl: hook.playgroundUrl,
    installCommand: config.content.installCommand,
    linkedInDraft,
    communityDraft,
    source: 'deterministic',
    caveats: [
      'Generated from the verified hook catalog only.',
      'Do not invent APIs, benchmarks, or unsupported claims before publishing.',
    ],
  };
}

function trimSentence(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\.$/, '').trim();
}
