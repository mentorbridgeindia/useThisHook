import type {
  AuditFinding,
  GrowthSnapshot,
  PeriodComparison,
  PrioritizedAction,
} from '../types.js';

export function prioritizeActions(
  snapshot: GrowthSnapshot,
  comparisons: PeriodComparison[],
  audit: AuditFinding[],
): PrioritizedAction[] {
  const actions: PrioritizedAction[] = [];

  const downloads7d = comparisons.find((item) => item.key === 'npm.downloads.7d');
  if (downloads7d?.sufficientHistory && (downloads7d.percentChange ?? 0) < -15) {
    actions.push({
      id: 'investigate-download-drop',
      title: 'Investigate week-over-week download decline',
      rationale:
        'Observed 7-day downloads fell versus the prior 7-day window. This is correlational, not causal.',
      expectedImpact: 'high',
      effort: 'medium',
      confidence: 'medium',
      evidence: [
        `current=${downloads7d.current}`,
        `previous=${downloads7d.previous}`,
        `changePct=${formatPct(downloads7d.percentChange)}`,
      ],
      hypothesis: 'Discovery or install friction may have increased for a subset of developers.',
      missingEvidence: [
        'Search Console query trends',
        'Referrer / campaign data',
        'npm version adoption mix',
      ],
    });
  }

  if (snapshot.sources.gsc !== 'ok') {
    actions.push({
      id: 'enable-search-console',
      title: 'Enable Google Search Console collection',
      rationale:
        'Organic search demand is currently unobserved, so discovery hypotheses cannot be validated.',
      expectedImpact: 'high',
      effort: 'low',
      confidence: 'high',
      evidence: [`gsc.status=${snapshot.sources.gsc}`],
      missingEvidence: ['Configured GSC_SERVICE_ACCOUNT_JSON and GSC_SITE_URL secrets'],
    });
  } else if (snapshot.gsc && snapshot.gsc.totalImpressions > 0 && snapshot.gsc.totalClicks === 0) {
    actions.push({
      id: 'improve-ctr-pages',
      title: 'Improve titles/descriptions for impressed but unclicked queries',
      rationale: 'Search Console shows impressions without clicks in the observed window.',
      expectedImpact: 'medium',
      effort: 'medium',
      confidence: 'medium',
      evidence: [
        `impressions=${snapshot.gsc.totalImpressions}`,
        `clicks=${snapshot.gsc.totalClicks}`,
      ],
      hypothesis: 'Snippet relevance or title clarity may be weak for top queries.',
      missingEvidence: ['Manual SERP review for top queries'],
    });
  }

  const highAudit = audit.filter((item) => item.severity === 'high');
  if (highAudit.length > 0) {
    actions.push({
      id: 'fix-high-audit-findings',
      title: 'Fix high-severity documentation findings',
      rationale: 'Docs gaps can block qualified adoption even when package APIs are solid.',
      expectedImpact: 'high',
      effort: 'low',
      confidence: 'high',
      evidence: highAudit.slice(0, 5).map((item) => `${item.path}: ${item.message}`),
    });
  }

  if ((snapshot.github?.stars ?? 0) < 20) {
    actions.push({
      id: 'ship-problem-first-tutorial',
      title: 'Publish one problem-first tutorial from this week’s draft',
      rationale:
        'Low star count with a mature hook catalog suggests discovery, not feature breadth, is the bottleneck.',
      expectedImpact: 'medium',
      effort: 'medium',
      confidence: 'medium',
      evidence: [`github.stars=${snapshot.github?.stars ?? 'missing'}`],
      hypothesis:
        'Developers find generic hook lists less useful than one concrete problem walkthrough.',
      missingEvidence: ['Post-publish referral traffic to the playground page'],
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: 'maintain-weekly-signal',
      title: 'Keep collecting weekly signal and ship one reviewed content draft',
      rationale: 'No high-confidence regression was observed; continue the measurement loop.',
      expectedImpact: 'low',
      effort: 'low',
      confidence: 'high',
      evidence: snapshot.observations.slice(0, 4).map((item) => `${item.key}=${item.value}`),
    });
  }

  return sortActions(actions).slice(0, 5);
}

function sortActions(actions: PrioritizedAction[]): PrioritizedAction[] {
  const rank = { high: 3, medium: 2, low: 1 };
  return [...actions].sort((a, b) => {
    const scoreA = rank[a.expectedImpact] * 3 + rank[a.confidence] * 2 - rank[a.effort];
    const scoreB = rank[b.expectedImpact] * 3 + rank[b.confidence] * 2 - rank[b.effort];
    return scoreB - scoreA;
  });
}

function formatPct(value: number | null): string {
  if (value == null) return 'n/a';
  return `${value.toFixed(1)}%`;
}
