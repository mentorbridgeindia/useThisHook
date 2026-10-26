export type SourceStatus = 'ok' | 'unavailable' | 'not_configured';

export interface SourceResult<T> {
  status: SourceStatus;
  data?: T;
  error?: string;
  observed: boolean;
}

export interface NpmDownloadsWindow {
  start: string;
  end: string;
  downloads: number;
}

export interface NpmMetrics {
  name: string;
  version: string;
  description: string;
  homepage?: string;
  repositoryUrl?: string;
  license?: string;
  downloads7d: NpmDownloadsWindow;
  downloads28d: NpmDownloadsWindow;
  previousDownloads7d: NpmDownloadsWindow;
  previousDownloads28d: NpmDownloadsWindow;
}

export interface GithubMetrics {
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  defaultBranch: string;
  homepage: string | null;
  pushedAt: string;
  latestReleaseTag: string | null;
  latestReleasePublishedAt: string | null;
  trafficViews?: number;
  trafficClones?: number;
  trafficUnavailableReason?: string;
}

export interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscMetrics {
  siteUrl: string;
  startDate: string;
  endDate: string;
  rows: GscRow[];
  totalClicks: number;
  totalImpressions: number;
}
