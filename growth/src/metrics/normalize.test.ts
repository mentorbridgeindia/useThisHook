import { describe, expect, it } from 'vitest';
import type { CollectedSources } from '../collectors/index.js';
import { normalizeSnapshot } from './normalize.js';

describe('normalizeSnapshot', () => {
  it('marks observed npm and github values and records missing gsc', () => {
    const sources: CollectedSources = {
      npm: {
        status: 'ok',
        observed: true,
        data: {
          name: 'usethishook',
          version: '1.2.0',
          description: 'hooks',
          downloads7d: { start: '2026-10-18', end: '2026-10-24', downloads: 40 },
          previousDownloads7d: { start: '2026-10-11', end: '2026-10-17', downloads: 30 },
          downloads28d: { start: '2026-09-27', end: '2026-10-24', downloads: 120 },
          previousDownloads28d: { start: '2026-08-30', end: '2026-09-26', downloads: 90 },
        },
      },
      github: {
        status: 'ok',
        observed: true,
        data: {
          fullName: 'senthilkumar979/useThisHook',
          description: 'hooks',
          stars: 3,
          forks: 0,
          openIssues: 11,
          watchers: 3,
          defaultBranch: 'main',
          homepage: 'https://usethishook.mentorbridge.in',
          pushedAt: '2026-10-21T03:12:12Z',
          latestReleaseTag: 'v1.2.0',
          latestReleasePublishedAt: '2026-10-14T00:00:00Z',
          trafficUnavailableReason: 'no admin',
        },
      },
      gsc: { status: 'not_configured', observed: false, error: 'not configured' },
    };

    const snapshot = normalizeSnapshot(sources, 'usethishook', '2026-10-26T00:00:00.000Z');
    expect(snapshot.sources.npm).toBe('ok');
    expect(snapshot.observations.find((item) => item.key === 'npm.downloads.7d')?.kind).toBe(
      'observed',
    );
    expect(snapshot.missing.some((item) => item.includes('gsc'))).toBe(true);
    expect(snapshot.missing.some((item) => item.includes('github.traffic'))).toBe(true);
  });
});
