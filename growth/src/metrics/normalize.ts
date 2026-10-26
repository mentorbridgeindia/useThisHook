import type { CollectedSources } from '../collectors/index.js';
import type { GrowthSnapshot, MetricObservation } from '../types.js';

export function normalizeSnapshot(
  sources: CollectedSources,
  packageName: string,
  collectedAt = new Date().toISOString(),
): GrowthSnapshot {
  const observations: MetricObservation[] = [];
  const missing: string[] = [];

  if (sources.npm.status === 'ok' && sources.npm.data) {
    const npm = sources.npm.data;
    observations.push(
      observed('npm.version', npm.version),
      observed('npm.downloads.7d', npm.downloads7d.downloads),
      observed('npm.downloads.28d', npm.downloads28d.downloads),
      observed('npm.downloads.previous7d', npm.previousDownloads7d.downloads),
      observed('npm.downloads.previous28d', npm.previousDownloads28d.downloads),
    );
  } else {
    missing.push(`npm: ${sources.npm.error ?? 'unavailable'}`);
    observations.push(missingObs('npm.downloads.7d'), missingObs('npm.downloads.28d'));
  }

  if (sources.github.status === 'ok' && sources.github.data) {
    const github = sources.github.data;
    observations.push(
      observed('github.stars', github.stars),
      observed('github.forks', github.forks),
      observed('github.openIssues', github.openIssues),
      observed('github.latestRelease', github.latestReleaseTag),
    );
    if (github.trafficViews == null)
      missing.push(`github.traffic: ${github.trafficUnavailableReason ?? 'unavailable'}`);
    else observations.push(observed('github.trafficViews', github.trafficViews));
  } else {
    missing.push(`github: ${sources.github.error ?? 'unavailable'}`);
    observations.push(missingObs('github.stars'), missingObs('github.openIssues'));
  }

  if (sources.gsc.status === 'ok' && sources.gsc.data) {
    observations.push(
      observed('gsc.clicks.28d', sources.gsc.data.totalClicks),
      observed('gsc.impressions.28d', sources.gsc.data.totalImpressions),
    );
  } else if (sources.gsc.status === 'not_configured') {
    missing.push('gsc: not configured');
  } else {
    missing.push(`gsc: ${sources.gsc.error ?? 'unavailable'}`);
  }

  return {
    collectedAt,
    packageName,
    sources: {
      npm: sources.npm.status,
      github: sources.github.status,
      gsc: sources.gsc.status,
    },
    observations,
    missing,
    npm: sources.npm.data,
    github: sources.github.data,
    gsc: sources.gsc.data,
  };
}

function observed(key: string, value: number | string | null): MetricObservation {
  return { key, value, kind: 'observed' };
}

function missingObs(key: string): MetricObservation {
  return { key, value: null, kind: 'missing', note: 'Source unavailable in this run' };
}
