export interface GrowthConfig {
  packageName: string;
  github: { owner: string; repo: string };
  siteUrl: string;
  catalogPath: string;
  repoRootRelative: string;
  dataDir: string;
  reportsDir: string;
  limits: {
    maxHttpRequests: number;
    requestTimeoutMs: number;
    maxRetries: number;
    minGithubRateLimitRemaining: number;
    llmTimeoutMs: number;
    llmMaxOutputTokens: number;
    llmMaxCallsPerRun: number;
    maxPrDiffLines: number;
  };
  pullRequests: { enabled: boolean };
  content: {
    installCommand: string;
    recentTutorialLookback: number;
  };
}

export interface HookCatalogEntry {
  id: string;
  name: string;
  summary: string;
  whenToUse: string;
  category: string;
  description: string;
  example: string;
  playgroundUrl: string;
  import: string;
  api: {
    signature: string;
  };
}

export interface HookCatalogFile {
  hooks: HookCatalogEntry[];
}

export interface EnvConfig {
  publish: boolean;
  githubToken?: string;
  gscServiceAccountJson?: string;
  gscSiteUrl?: string;
  llmBaseUrl?: string;
  llmModel?: string;
  llmApiKey?: string;
  growthDataBranch: string;
}
