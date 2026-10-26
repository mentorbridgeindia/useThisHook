import type { GrowthSnapshot, PeriodComparison } from '../types.js';

export function comparePeriods(snapshot: GrowthSnapshot): PeriodComparison[] {
  const comparisons: PeriodComparison[] = [];

  if (snapshot.npm) {
    comparisons.push(
      compareNumeric(
        'npm.downloads.7d',
        snapshot.npm.downloads7d.downloads,
        snapshot.npm.previousDownloads7d.downloads,
      ),
      compareNumeric(
        'npm.downloads.28d',
        snapshot.npm.downloads28d.downloads,
        snapshot.npm.previousDownloads28d.downloads,
      ),
    );
  } else {
    comparisons.push(insufficient('npm.downloads.7d'), insufficient('npm.downloads.28d'));
  }

  if (snapshot.gsc) {
    comparisons.push({
      key: 'gsc.clicks.28d',
      current: snapshot.gsc.totalClicks,
      previous: null,
      absoluteChange: null,
      percentChange: null,
      sufficientHistory: false,
      note: 'Prior GSC window requires historical snapshots; only current 28d observed this run.',
    });
  }

  return comparisons;
}

export function compareWithHistory(
  current: GrowthSnapshot,
  previous: GrowthSnapshot | undefined,
): PeriodComparison[] {
  const base = comparePeriods(current);
  if (!previous?.github || !current.github) return base;

  return [
    ...base,
    compareNumeric('github.stars', current.github.stars, previous.github.stars),
    compareNumeric('github.openIssues', current.github.openIssues, previous.github.openIssues),
  ];
}

function compareNumeric(
  key: string,
  current: number | null | undefined,
  previous: number | null | undefined,
): PeriodComparison {
  if (current == null || previous == null) return insufficient(key);
  const absoluteChange = current - previous;
  const percentChange = previous === 0 ? null : (absoluteChange / previous) * 100;
  return {
    key,
    current,
    previous,
    absoluteChange,
    percentChange,
    sufficientHistory: true,
  };
}

function insufficient(key: string): PeriodComparison {
  return {
    key,
    current: null,
    previous: null,
    absoluteChange: null,
    percentChange: null,
    sufficientHistory: false,
    note: 'Insufficient observed history for a reliable comparison.',
  };
}
