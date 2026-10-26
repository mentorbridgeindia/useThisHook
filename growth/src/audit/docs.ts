import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { getPackageRoot } from '../config.js';
import { loadCatalog } from '../content/catalog.js';
import type { AuditFinding, GrowthConfig, HookCatalogEntry } from '../types.js';

export function auditDocumentation(config: GrowthConfig): AuditFinding[] {
  const packageRoot = getPackageRoot();
  const repoRoot = resolve(packageRoot, config.repoRootRelative);
  const catalog = loadCatalog(resolve(packageRoot, config.catalogPath));
  const findings: AuditFinding[] = [];

  for (const hook of catalog) {
    if (!hook.summary.trim())
      findings.push(
        finding(
          'missing-summary',
          'high',
          `catalog:${hook.id}`,
          'Missing summary',
          'Add a one-line summary in the playground docs source.',
        ),
      );
    if (!hook.whenToUse.trim())
      findings.push(
        finding(
          'missing-use-case',
          'high',
          `catalog:${hook.id}`,
          'Missing whenToUse',
          'Document when developers should reach for this hook.',
        ),
      );
    if (!hook.example.trim())
      findings.push(
        finding(
          'missing-example',
          'high',
          `catalog:${hook.id}`,
          'Missing example',
          'Add a runnable example to the hook docs.',
        ),
      );
    if (!hook.playgroundUrl.startsWith(config.siteUrl))
      findings.push(
        finding(
          'bad-playground-url',
          'medium',
          `catalog:${hook.id}`,
          'Playground URL does not match siteUrl',
          `Use ${config.siteUrl}/${hook.id}`,
        ),
      );
  }

  const sitemapPath = join(repoRoot, 'playground/public/sitemap.xml');
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, 'utf8');
    for (const hook of catalog) {
      const loc = `${config.siteUrl}/${hook.id}`;
      if (!sitemap.includes(`<loc>${loc}</loc>`))
        findings.push(
          finding(
            'sitemap-missing-hook',
            'medium',
            'playground/public/sitemap.xml',
            `Sitemap missing ${hook.id}`,
            'Regenerate sitemap with npm run playground:seo',
          ),
        );
    }
  } else {
    findings.push(
      finding(
        'sitemap-missing',
        'high',
        'playground/public/sitemap.xml',
        'Sitemap file is missing',
        'Run npm run playground:seo',
      ),
    );
  }

  findings.push(...auditMarkdownLinks(repoRoot, 'README.md'));
  const docsDir = join(repoRoot, 'docs');
  if (existsSync(docsDir)) {
    for (const name of readdirSync(docsDir)) {
      if (!name.endsWith('.md')) continue;
      findings.push(...auditMarkdownLinks(repoRoot, join('docs', name)));
    }
  }

  findings.push(...auditSeoDefaults(repoRoot, catalog));
  return findings;
}

function auditSeoDefaults(repoRoot: string, catalog: HookCatalogEntry[]): AuditFinding[] {
  const seoPath = join(repoRoot, 'playground/src/seo.ts');
  if (!existsSync(seoPath))
    return [
      finding(
        'seo-missing',
        'medium',
        'playground/src/seo.ts',
        'SEO helper missing',
        'Restore route SEO helper',
      ),
    ];

  const source = readFileSync(seoPath, 'utf8');
  const findings: AuditFinding[] = [];
  if (!source.includes('DEFAULT_DESCRIPTION'))
    findings.push(
      finding(
        'seo-default-description',
        'low',
        'playground/src/seo.ts',
        'Default description constant not found',
        'Keep a shared default meta description',
      ),
    );
  if (!source.includes('og:title'))
    findings.push(
      finding(
        'seo-og-title',
        'medium',
        'playground/src/seo.ts',
        'og:title meta handling missing',
        'Ensure Open Graph titles are set per route',
      ),
    );

  // Catalog presence is the source of truth for per-hook pages; flag empty catalog only.
  if (catalog.length === 0)
    findings.push(
      finding(
        'empty-catalog',
        'high',
        'mcp/data/catalog.json',
        'Catalog is empty',
        'Regenerate MCP catalog',
      ),
    );

  return findings;
}

function auditMarkdownLinks(repoRoot: string, relativePath: string): AuditFinding[] {
  const absolute = join(repoRoot, relativePath);
  if (!existsSync(absolute))
    return [
      finding(
        'missing-file',
        'medium',
        relativePath,
        'Expected markdown file is missing',
        'Restore the file or update references',
      ),
    ];

  const content = readFileSync(absolute, 'utf8');
  const findings: AuditFinding[] = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  for (const match of content.matchAll(linkPattern)) {
    const href = match[2];
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:'))
      continue;
    const cleaned = href.split('#')[0]?.split('?')[0];
    if (!cleaned) continue;
    const target = resolve(join(repoRoot, relativePath), '..', cleaned);
    if (!existsSync(target))
      findings.push(
        finding(
          'broken-link',
          'medium',
          relativePath,
          `Broken relative link: ${href}`,
          'Fix or remove the link',
        ),
      );
  }
  return findings;
}

function finding(
  id: string,
  severity: AuditFinding['severity'],
  path: string,
  message: string,
  suggestion: string,
): AuditFinding {
  return { id, severity, path, message, suggestion };
}
