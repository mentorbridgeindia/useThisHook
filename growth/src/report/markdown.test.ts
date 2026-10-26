import { describe, expect, it } from 'vitest';
import { renderGrowthReport } from './markdown.js';

describe('renderGrowthReport', () => {
  it('includes metrics, actions, and draft sections', () => {
    const markdown = renderGrowthReport({
      date: '2026-10-26',
      snapshot: {
        collectedAt: '2026-10-26T00:00:00.000Z',
        packageName: 'usethishook',
        sources: { npm: 'ok', github: 'ok', gsc: 'not_configured' },
        observations: [{ key: 'npm.downloads.7d', value: 10, kind: 'observed' }],
        missing: ['gsc: not configured'],
      },
      comparisons: [
        {
          key: 'npm.downloads.7d',
          current: 10,
          previous: 8,
          absoluteChange: 2,
          percentChange: 25,
          sufficientHistory: true,
        },
      ],
      actions: [
        {
          id: 'a1',
          title: 'Ship one tutorial',
          rationale: 'Discovery needs a concrete walkthrough.',
          expectedImpact: 'medium',
          effort: 'medium',
          confidence: 'medium',
          evidence: ['stars=3'],
        },
      ],
      content: {
        hookId: 'useConfirm',
        hookName: 'useConfirm',
        title: 'Await confirm()',
        outline: ['Install', 'Example'],
        example: 'const confirm = useConfirm();',
        playgroundUrl: 'https://usethishook.mentorbridge.in/useConfirm',
        installCommand: 'npm install usethishook',
        linkedInDraft: 'Draft',
        communityDraft: 'Draft',
        source: 'deterministic',
        caveats: ['review'],
      },
      audit: [],
      limitations: ['No GSC'],
    });

    expect(markdown).toContain('# Growth report — 2026-10-26');
    expect(markdown).toContain('## Prioritized actions');
    expect(markdown).toContain('useConfirm');
    expect(markdown).toContain('Human review required');
  });
});
