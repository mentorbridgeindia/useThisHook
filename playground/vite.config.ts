import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import { prerenderSeoPages } from './prerenderSeo';

const playgroundRoot = path.dirname(fileURLToPath(import.meta.url));
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

/** GitHub Pages serves 404.html for unknown paths — copy index.html so the SPA boots. */
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const outDir = path.resolve(playgroundRoot, 'dist');
      const indexHtml = path.join(outDir, 'index.html');
      const fallback = path.join(outDir, '404.html');
      if (fs.existsSync(indexHtml)) fs.copyFileSync(indexHtml, fallback);
    },
  };
}

export default defineConfig({
  root: playgroundRoot,
  // Load VITE_* from repo root (.env.local) so local and Vercel env vars stay aligned.
  envDir: path.resolve(playgroundRoot, '..'),
  // Absolute base required for History API path routing.
  // Custom domain / local / Vercel: `/`. GitHub project Pages: `/useThisHook/`.
  base: isGitHubPages ? '/useThisHook/' : '/',
  plugins: [react(), tailwindcss(), spaFallback404(), prerenderSeoPages()],
  resolve: {
    alias: {
      usethishook: path.resolve(playgroundRoot, '../src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
});
