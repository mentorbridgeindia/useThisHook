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
  ];

  if (input.comparisons.length === 0) {
    lines.push('_No comparisons available._', '');
  } else {
    lines.push(
      '| Metric | Current | Previous | Change | Sufficient history |',
      '| --- | --- | --- | --- | --- |',
    );
    for (const comparison of input.comparisons) {
      lines.push(
        `| ${comparison.key} | ${formatValue(comparison.current)} | ${formatValue(comparison.previous)} | ${formatChange(comparison)} | ${comparison.sufficientHistory ? 'yes' : 'no'} |`,
      );
    }
    lines.push('');
  }

  lines.push('## Limitations', '');
  for (const limitation of input.limitations) lines.push(`- ${limitation}`);
  if (input.snapshot.missing.length > 0) {
    lines.push('', '### Missing or unreliable data', '');
    for (const missing of input.snapshot.missing) lines.push(`- ${missing}`);
  }

  lines.push('', '## Prioritized actions', '');
  for (const [index, action] of input.actions.entries()) {
    lines.push(
      `### ${index + 1}. ${action.title}`,
      '',
      `- Impact: ${action.expectedImpact}`,
      `- Effort: ${action.effort}`,
      `- Confidence: ${action.confidence}`,
      `- Rationale: ${action.rationale}`,
    );
    if (action.hypothesis) lines.push(`- Hypothesis: ${action.hypothesis}`);
    if (action.evidence.length) lines.push(`- Evidence: ${action.evidence.join('; ')}`);
    if (action.missingEvidence?.length)
      lines.push(`- Missing evidence: ${action.missingEvidence.join('; ')}`);
    lines.push('');
  }

  lines.push(
    '## Content draft',
    '',
    `- Source: ${input.content.source}`,
    `- Hook: ${input.content.hookName}`,
    `- Title: ${input.content.title}`,
    `- Playground: ${input.content.playgroundUrl}`,
    `- Install: \`${input.content.installCommand}\``,
    '',
    '### Outline',
    '',
    ...input.content.outline.map((item) => `- ${item}`),
    '',
    '### Example',
    '',
    '```tsx',
    input.content.example,
    '```',
    '',
    '### LinkedIn draft (review before posting)',
    '',
    input.content.linkedInDraft,
    '',
    '### Community draft (review before posting)',
    '',
    input.content.communityDraft,
    '',
    '## Documentation audit',
    '',
  );

  if (input.audit.length === 0) {
    lines.push('_No documentation findings in this run._', '');
  } else {
    for (const item of input.audit.slice(0, 25)) {
      lines.push(
        `- **${item.severity}** \`${item.path}\`: ${item.message}`,
        `  - Suggestion: ${item.suggestion}`,
      );
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
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
