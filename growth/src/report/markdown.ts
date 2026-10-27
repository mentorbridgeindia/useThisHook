import type {
  AuditFinding,
  ContentDraft,
  GrowthSnapshot,
  PeriodComparison,
  PrioritizedAction,
} from '../types.js';

export function renderGrowthReport(input: {
  date: string;
  snapshot: GrowthSnapshot;
  comparisons: PeriodComparison[];
  actions: PrioritizedAction[];
  content: ContentDraft;
  audit: AuditFinding[];
  limitations: string[];
}): string {
  const lines: string[] = [
    `# Growth report — ${input.date}`,
    '',
    'Human review required. This agent never posts to LinkedIn, DEV, Reddit, or npm.',
    '',
    '## Metrics',
    '',
    '| Key | Value | Kind |',
    '| --- | --- | --- |',
    ...input.snapshot.observations.map(
      (item) => `| ${item.key} | ${formatValue(item.value)} | ${item.kind} |`,
    ),
    '',
    '## Trends',
    '',
    ...renderTrends(input.comparisons),
    '## Limitations',
    '',
    ...input.limitations.map((limitation) => `- ${limitation}`),
    ...renderMissing(input.snapshot.missing),
    '',
    '## Prioritized actions',
    '',
    ...renderActions(input.actions),
    ...renderContent(input.content),
    '## Documentation audit',
    '',
    ...renderAudit(input.audit),
  ];

  return `${lines.join('\n').trim()}\n`;
}

function renderTrends(comparisons: PeriodComparison[]): string[] {
  if (comparisons.length === 0) return ['_No comparisons available._', ''];
  return [
    '| Metric | Current | Previous | Change | Sufficient history |',
    '| --- | --- | --- | --- | --- |',
    ...comparisons.map(
      (comparison) =>
        `| ${comparison.key} | ${formatValue(comparison.current)} | ${formatValue(comparison.previous)} | ${formatChange(comparison)} | ${comparison.sufficientHistory ? 'yes' : 'no'} |`,
    ),
    '',
  ];
}

function renderMissing(missing: string[]): string[] {
  if (missing.length === 0) return [];
  return ['', '### Missing or unreliable data', '', ...missing.map((item) => `- ${item}`)];
}

function renderActions(actions: PrioritizedAction[]): string[] {
  return actions.flatMap((action, index) => {
    const lines = [
      `### ${index + 1}. ${action.title}`,
      '',
      `- Impact: ${action.expectedImpact}`,
      `- Effort: ${action.effort}`,
      `- Confidence: ${action.confidence}`,
      `- Rationale: ${action.rationale}`,
    ];
    if (action.hypothesis) lines.push(`- Hypothesis: ${action.hypothesis}`);
    if (action.evidence.length) lines.push(`- Evidence: ${action.evidence.join('; ')}`);
    if (action.missingEvidence?.length)
      lines.push(`- Missing evidence: ${action.missingEvidence.join('; ')}`);
    lines.push('');
    return lines;
  });
}

function renderContent(content: ContentDraft): string[] {
  return [
    '## Content draft',
    '',
    `- Source: ${content.source}`,
    `- Hook: ${content.hookName}`,
    `- Title: ${content.title}`,
    `- Playground: ${content.playgroundUrl}`,
    `- Install: \`${content.installCommand}\``,
    '',
    '### Outline',
    '',
    ...content.outline.map((item) => `- ${item}`),
    '',
    '### Example',
    '',
    '```tsx',
    content.example,
    '```',
    '',
    '### LinkedIn draft (review before posting)',
    '',
    content.linkedInDraft,
    '',
    '### Community draft (review before posting)',
    '',
    content.communityDraft,
    '',
  ];
}

function renderAudit(audit: AuditFinding[]): string[] {
  if (audit.length === 0) return ['_No documentation findings in this run._', ''];
  return [
    ...audit
      .slice(0, 25)
      .flatMap((item) => [
        `- **${item.severity}** \`${item.path}\`: ${item.message}`,
        `  - Suggestion: ${item.suggestion}`,
      ]),
    '',
  ];
}

function formatValue(value: number | string | null | undefined): string {
  if (value == null) return 'n/a';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return value;
}

function formatChange(comparison: PeriodComparison): string {
  if (!comparison.sufficientHistory || comparison.absoluteChange == null) return 'n/a';
  const pct = comparison.percentChange == null ? 'n/a' : `${comparison.percentChange.toFixed(1)}%`;
  return `${comparison.absoluteChange} (${pct})`;
}
