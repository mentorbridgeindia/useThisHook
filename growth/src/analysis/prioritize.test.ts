import { describe, expect, it } from 'vitest';
import type { GrowthSnapshot, PeriodComparison } from '../types.js';
import { prioritizeActions } from './prioritize.js';

describe('prioritizeActions', () => {
  it('flags download declines without claiming causation', () => {
    const snapshot: GrowthSnapshot = {
      collectedAt: '2026-10-26T00:00:00.000Z',
      packageName: 'usethishook',
      sources: { npm: 'ok', github: 'ok', gsc: 'not_configured' },
      observations: [],
      missing: ['gsc: not configured'],
      github: {
        fullName: 'senthilkumar979/useThisHook',
        description: null,
        stars: 3,
        forks: 0,
        openIssues: 1,
        watchers: 3,
        defaultBranch: 'main',
        homepage: null,
        pushedAt: '2026-10-21T00:00:00Z',
        latestReleaseTag: '1.2.0',
        latestReleasePublishedAt: '2026-10-14T00:00:00Z',
      },
    };
    const comparisons: PeriodComparison[] = [
      {
        key: 'npm.downloads.7d',
        current: 2,
        previous: 200,
        absoluteChange: -198,
        percentChange: -99,
        sufficientHistory: true,
      },
    ];

    const actions = prioritizeActions(snapshot, comparisons, []);
    expect(actions.some((action) => action.id === 'investigate-download-drop')).toBe(true);
    expect(actions.some((action) => action.id === 'enable-search-console')).toBe(true);
    const decline = actions.find((action) => action.id === 'investigate-download-drop');
    expect(decline?.rationale).toMatch(/correlational/i);
  });
});
