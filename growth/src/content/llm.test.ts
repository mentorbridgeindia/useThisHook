import { describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../http.js';
import type { EnvConfig, GrowthConfig, HookCatalogEntry } from '../types.js';
import { generateContentDraft } from './llm.js';

const hook: HookCatalogEntry = {
  id: 'useBoolean',
  name: 'useBoolean',
  summary: 'Boolean helpers.',
  whenToUse: 'Use for toggles.',
  category: 'State',
  description: 'Boolean state helpers.',
  example: 'const flag = useBoolean(false);',
  playgroundUrl: 'https://usethishook.mentorbridge.in/useBoolean',
  import: "import { useBoolean } from 'usethishook';",
  api: { signature: 'useBoolean(initialValue: boolean)' },
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
} satisfies GrowthConfig;

describe('generateContentDraft', () => {
  it('falls back when LLM is not configured', async () => {
    const http = new HttpClient({
      maxRequests: 5,
      timeoutMs: 1000,
      maxRetries: 0,
      minGithubRateLimitRemaining: 10,
    });
    const env: EnvConfig = { publish: false, growthDataBranch: 'growth-data' };
    const draft = await generateContentDraft(http, hook, [hook], config, env);
    expect(draft.source).toBe('deterministic');
    expect(draft.hookName).toBe('useBoolean');
  });

  it('falls back when LLM returns an invalid hook', async () => {
    const http = new HttpClient({
      maxRequests: 5,
      timeoutMs: 1000,
      maxRetries: 0,
      minGithubRateLimitRemaining: 10,
    });
    vi.spyOn(http, 'post').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: 'Magic',
                outline: ['one'],
                linkedInDraft: 'useFakeHook is amazing',
                communityDraft: 'useFakeHook forever',
              }),
            },
          },
        ],
      }),
      json: <T>() =>
        ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'Magic',
                  outline: ['one'],
                  linkedInDraft: 'useFakeHook is amazing',
                  communityDraft: 'useFakeHook forever',
                }),
              },
            },
          ],
        }) as T,
    });

    const env: EnvConfig = {
      publish: false,
      growthDataBranch: 'growth-data',
      llmApiKey: 'test-key',
      llmBaseUrl: 'https://example.com/v1',
      llmModel: 'test-model',
    };
    const draft = await generateContentDraft(http, hook, [hook], config, env);
    expect(draft.source).toBe('deterministic');
  });
});
