import { describe, expect, it } from 'vitest';
import type { GrowthSnapshot } from '../types.js';
import { comparePeriods, compareWithHistory } from './compare.js';

function snapshot(partial: Partial<GrowthSnapshot> = {}): GrowthSnapshot {
  return {
    collectedAt: '2026-10-26T00:00:00.000Z',
    packageName: 'usethishook',
    sources: { npm: 'ok', github: 'ok', gsc: 'not_configured' },
    observations: [],
    missing: [],
    npm: {
      name: 'usethishook',
      version: '1.2.0',
      description: 'hooks',
      downloads7d: { start: 'a', end: 'b', downloads: 50 },
      previousDownloads7d: { start: 'c', end: 'd', downloads: 40 },
      downloads28d: { start: 'e', end: 'f', downloads: 200 },
      previousDownloads28d: { start: 'g', end: 'h', downloads: 100 },
    },
    github: {
      fullName: 'senthilkumar979/useThisHook',
      description: null,
      stars: 5,
      forks: 0,
      openIssues: 2,
      watchers: 5,
      defaultBranch: 'main',
      homepage: null,
      pushedAt: '2026-10-21T00:00:00Z',
      latestReleaseTag: 'v1.2.0',
      latestReleasePublishedAt: '2026-10-14T00:00:00Z',
    },
    ...partial,
  };
}

describe('comparePeriods', () => {
  it('computes download changes when both windows exist', () => {
    const comparisons = comparePeriods(snapshot());
    const week = comparisons.find((item) => item.key === 'npm.downloads.7d');
    expect(week?.sufficientHistory).toBe(true);
    expect(week?.absoluteChange).toBe(10);
    expect(week?.percentChange).toBeCloseTo(25);
  });

  it('marks comparisons insufficient without npm data', () => {
    const comparisons = comparePeriods(
      snapshot({
        npm: undefined,
        sources: { npm: 'unavailable', github: 'ok', gsc: 'not_configured' },
      }),
    );
    expect(
      comparisons.every((item) => (item.key.startsWith('npm') ? !item.sufficientHistory : true)),
    ).toBe(true);
  });
});

describe('compareWithHistory', () => {
  it('adds github deltas from the previous snapshot', () => {
    const current = snapshot();
    const previous = snapshot({
      github: current.github && { ...current.github, stars: 3, openIssues: 4 },
    });
    const comparisons = compareWithHistory(current, previous);
    expect(comparisons.find((item) => item.key === 'github.stars')?.absoluteChange).toBe(2);
  });
});
