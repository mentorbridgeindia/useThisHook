import { describe, expect, it } from 'vitest';
import type { ContentDraft, HookCatalogEntry } from '../types.js';
import { buildDeterministicDraft } from './deterministic.js';
import { validateContentDraft } from './validate.js';

const hook: HookCatalogEntry = {
  id: 'useConfirm',
  name: 'useConfirm',
  summary: 'Promise-based confirm dialogs.',
  whenToUse: 'Use when you need awaitable confirmations.',
  category: 'App',
  description: 'Promise-based confirm dialogs without a UI kit.',
  example: 'const confirm = useConfirm();\nawait confirm({ title: "Delete?" });',
  playgroundUrl: 'https://usethishook.mentorbridge.in/useConfirm',
  import: "import { useConfirm } from 'usethishook';",
  api: { signature: 'useConfirm()' },
};

const config = {
  packageName: 'usethishook',
  github: { owner: 'a', repo: 'b' },
  siteUrl: 'https://usethishook.mentorbridge.in',
  catalogPath: '../mcp/data/catalog.json',
  repoRootRelative: '..',
  dataDir: 'data/snapshots',
  reportsDir: 'reports',
  limits: {
    maxHttpRequests: 25,
    requestTimeoutMs: 10000,
    maxRetries: 2,
    minGithubRateLimitRemaining: 10,
    llmTimeoutMs: 20000,
    llmMaxOutputTokens: 1200,
    llmMaxCallsPerRun: 1,
    maxPrDiffLines: 40,
  },
  pullRequests: { enabled: false },
  content: { installCommand: 'npm install usethishook', recentTutorialLookback: 8 },
};

describe('validateContentDraft', () => {
  it('accepts catalog-bound deterministic drafts', () => {
    const draft = buildDeterministicDraft(hook, config);
    expect(validateContentDraft(draft, [hook]).ok).toBe(true);
  });

  it('rejects invented hook names', () => {
    const draft: ContentDraft = {
      ...buildDeterministicDraft(hook, config),
      communityDraft: 'Try useMadeUpHook for magic performance gains.',
    };
    const result = validateContentDraft(draft, [hook]);
    expect(result.ok).toBe(false);
    expect(result.reasons.some((reason) => reason.includes('useMadeUpHook'))).toBe(true);
  });

  it('rejects mismatched playground URLs', () => {
    const draft: ContentDraft = {
      ...buildDeterministicDraft(hook, config),
      playgroundUrl: 'https://example.com/wrong',
    };
    expect(validateContentDraft(draft, [hook]).ok).toBe(false);
  });
});
