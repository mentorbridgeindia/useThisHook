import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const playgroundRoot = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://usethishook.mentorbridge.in';
const HOME_TITLE = 'useThisHook — promise dialogs and zero-dep React hooks';
const HOME_DESCRIPTION =
  'Promise-based confirm/prompt dialogs and 53 tree-shakeable React hooks. Zero runtime deps, TypeScript, live playground.';
const HOME_OG_DESCRIPTION =
  'Promise-based confirm/prompt dialogs and 53 tree-shakeable React hooks. Zero runtime deps, live playground.';

interface SeoPage {
  id: string;
  title: string;
  description: string;
}

function escapeAttr(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function patchHtml(html: string, page: SeoPage) {
  const canonical = `${SITE}/${page.id}`;
  return html
    .split(HOME_TITLE)
    .join(page.title)
    .split(HOME_DESCRIPTION)
    .join(page.description)
    .split(HOME_OG_DESCRIPTION)
    .join(page.description)
    .split(`href="${SITE}/"`)
    .join(`href="${canonical}"`)
    .split(`content="${SITE}/"`)
    .join(`content="${canonical}"`);
}

export function prerenderSeoPages(): Plugin {
  return {
    name: 'prerender-seo-pages',
    closeBundle() {
      const outDir = path.resolve(playgroundRoot, 'dist');
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      const indexHtml = fs.readFileSync(indexPath, 'utf8');
      const catalogPath = path.resolve(playgroundRoot, '../mcp/data/catalog.json');
      const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as {
        hooks: Array<{ id: string; name: string; summary: string; whenToUse: string }>;
      };

      const pages: SeoPage[] = [
        {
          id: 'compare',
          title: 'useThisHook vs usehooks-ts and react-use',
          description: escapeAttr(
            'Compare usethishook with usehooks-ts and react-use: zero runtime deps, promise dialogs, live playground, and MCP.',
          ),
        },
        {
          id: 'mcp',
          title: 'usethishook-mcp — React hook docs for Cursor and Claude',
          description: escapeAttr(
            'MCP server for useThisHook. Search 53 TypeScript React hooks from Cursor and Claude Desktop.',
          ),
        },
        ...catalog.hooks.map((hook) => ({
          id: hook.id,
          title: `${hook.name} React hook — useThisHook`,
          description: escapeAttr(`${hook.summary} ${hook.whenToUse}`),
        })),
      ];

      for (const page of pages) {
        const dir = path.join(outDir, page.id);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), patchHtml(indexHtml, page));
      }
    },
  };
}
