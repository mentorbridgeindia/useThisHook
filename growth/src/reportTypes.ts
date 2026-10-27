import type { GithubMetrics, GscMetrics, NpmMetrics, SourceStatus } from './sourceTypes.js';

export interface MetricObservation {
  key: string;
  value: number | string | null;
  kind: 'observed' | 'missing' | 'assumed';
  note?: string;
}

export interface PeriodComparison {
  key: string;
  current: number | null;
  previous: number | null;
  absoluteChange: number | null;
  percentChange: number | null;
  sufficientHistory: boolean;
  note?: string;
}

export interface GrowthSnapshot {
  collectedAt: string;
  packageName: string;
  sources: {
    npm: SourceStatus;
    github: SourceStatus;
    gsc: SourceStatus;
  };
  observations: MetricObservation[];
  missing: string[];
  npm?: NpmMetrics;
  github?: GithubMetrics;
  gsc?: GscMetrics;
  tutorialHookId?: string;
}

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface PrioritizedAction {
  id: string;
  title: string;
  rationale: string;
  expectedImpact: PriorityLevel;
  effort: PriorityLevel;
  confidence: PriorityLevel;
  evidence: string[];
  hypothesis?: string;
  missingEvidence?: string[];
}

export interface ContentDraft {
  hookId: string;
  hookName: string;
  title: string;
  outline: string[];
  example: string;
  playgroundUrl: string;
  installCommand: string;
  linkedInDraft: string;
  communityDraft: string;
  source: 'deterministic' | 'llm';
  caveats: string[];
}

export interface AuditFinding {
  id: string;
  severity: 'high' | 'medium' | 'low';
  path: string;
  message: string;
  suggestion: string;
  deterministicPatch?: {
    path: string;
    summary: string;
  };
}

export interface GrowthReport {
  date: string;
  snapshot: GrowthSnapshot;
  comparisons: PeriodComparison[];
  actions: PrioritizedAction[];
  content: ContentDraft;
  audit: AuditFinding[];
  limitations: string[];
  markdown: string;
}
