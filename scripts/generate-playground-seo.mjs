#!/usr/bin/env node
/**
 * Writes playground/public/robots.txt and sitemap.xml from hook source files.
 * Run before playground builds: npm run playground:seo
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'playground/public');
const hooksDir = path.join(root, 'src/hooks');
const SITE = 'https://usethishook.mentorbridge.in';

const hookIds = fs
  .readdirSync(hooksDir)
  .filter((name) => /^use[A-Za-z0-9]+\.(ts|tsx)$/.test(name))
  .map((name) => name.replace(/\.(ts|tsx)$/, ''))
  .filter((id) => id !== 'dialogFrame')
  .sort((a, b) => a.localeCompare(b));

const urls = [
  { loc: `${SITE}/`, priority: '1.0' },
  ...hookIds.map((id) => ({ loc: `${SITE}/${id}`, priority: '0.8' })),
];

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
console.log(`Wrote robots.txt and sitemap.xml (${urls.length} URLs)`);
