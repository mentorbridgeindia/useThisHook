/**
 * Builds mcp/data/catalog.json from playground docs (API + descriptions + demos).
 * Run via: npm run mcp:catalog
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const playgroundSrc = path.join(root, 'playground', 'src');
const outPath = path.join(root, 'mcp', 'data', 'catalog.json');
const playgroundUrl = 'https://usethishook.mentorbridge.in';
const nodeBin = process.execPath;
const tsxCli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const prettierCli = path.join(root, 'node_modules', 'prettier', 'bin', 'prettier.cjs');

const hookGroupFiles = ['stateHooks.ts', 'browserHooks.ts', 'appHooks.ts', 'leverageHooks.ts'];

const examplePattern = /export const (use\w+Example) = `([\s\S]*?)`;/g;

function readQuotedField(block, field) {
  const needle = `${field}:`;
  const start = block.indexOf(needle);
  if (start < 0) return undefined;
  const after = block.slice(start + needle.length).trimStart();
  if (!after.startsWith("'")) return undefined;
  const end = after.indexOf("'", 1);
  if (end < 0) return undefined;
  return after.slice(1, end);
}

function readTags(chunk) {
  const match = chunk.match(/tags:\s*\[([^\]]*)\]/);
  if (!match) return undefined;
  const tags = [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
  return tags.length > 0 ? tags : undefined;
}

function parseHookEntries(source) {
  const entries = [];
  for (const chunk of source.split('{')) {
    const id = readQuotedField(chunk, 'id');
    if (!id?.startsWith('use')) continue;
    const name = readQuotedField(chunk, 'name');
    const summary = readQuotedField(chunk, 'summary');
    const whenToUse = readQuotedField(chunk, 'whenToUse');
    const category = readQuotedField(chunk, 'category');
    const tags = readTags(chunk);
    const apiIndex = chunk.indexOf('api:');
    const apiToken =
      apiIndex >= 0
        ? chunk
            .slice(apiIndex + 4)
            .trimStart()
            .match(/^(\w+)/)?.[1]
        : undefined;
    if (!name || !summary || !whenToUse || !category || !apiToken) {
      throw new Error(`Incomplete catalog entry near id ${id}`);
    }
    entries.push({
      id,
      name,
      summary,
      whenToUse,
      category,
      tags,
      apiExport: apiToken,
    });
  }
  return entries;
}

function loadExamples() {
  const demosDir = path.join(playgroundSrc, 'demos');
  /** @type {Record<string, string>} */
  const examples = {};
  for (const file of fs.readdirSync(demosDir)) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
    const source = fs.readFileSync(path.join(demosDir, file), 'utf8');
    for (const match of source.matchAll(examplePattern)) {
      const exportName = match[1];
      const hookId = exportName.replace(/Example$/, '');
      examples[hookId] = match[2];
    }
  }
  return examples;
}

function loadApisAndDescriptions() {
  const loader = `
import { writeFileSync } from 'node:fs';
import { hookDescriptions } from ${JSON.stringify(path.join(playgroundSrc, 'descriptions/hookDescriptions.ts'))};
import * as appCoreApi from ${JSON.stringify(path.join(playgroundSrc, 'api/appCoreApi.ts'))};
import * as appFormApi from ${JSON.stringify(path.join(playgroundSrc, 'api/appFormApi.ts'))};
import * as appListApi from ${JSON.stringify(path.join(playgroundSrc, 'api/appListApi.ts'))};
import * as browserApi from ${JSON.stringify(path.join(playgroundSrc, 'api/browserApi.ts'))};
import * as browserEventsApi from ${JSON.stringify(path.join(playgroundSrc, 'api/browserEventsApi.ts'))};
import * as coreStateApi from ${JSON.stringify(path.join(playgroundSrc, 'api/coreStateApi.ts'))};
import * as flowApi from ${JSON.stringify(path.join(playgroundSrc, 'api/flowApi.ts'))};
import * as leverageApi from ${JSON.stringify(path.join(playgroundSrc, 'api/leverageApi.ts'))};
import * as persistApi from ${JSON.stringify(path.join(playgroundSrc, 'api/persistApi.ts'))};

const apis = {
  ...appCoreApi,
  ...appFormApi,
  ...appListApi,
  ...browserApi,
  ...browserEventsApi,
  ...coreStateApi,
  ...flowApi,
  ...leverageApi,
  ...persistApi,
};

writeFileSync(process.argv[2], JSON.stringify({ descriptions: hookDescriptions, apis }));
`;

  const tmpLoader = path.join(root, 'scripts', '.tmp-mcp-catalog-loader.mts');
  const tmpOut = path.join(root, 'scripts', '.tmp-mcp-catalog-payload.json');
  fs.writeFileSync(tmpLoader, loader);
  try {
    execFileSync(nodeBin, [tsxCli, tmpLoader, tmpOut], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    return JSON.parse(fs.readFileSync(tmpOut, 'utf8'));
  } finally {
    for (const file of [tmpLoader, tmpOut]) {
      try {
        fs.unlinkSync(file);
      } catch {
        // ignore cleanup failures
      }
    }
  }
}

function main() {
  if (!fs.existsSync(tsxCli)) {
    throw new Error(`Missing tsx CLI at ${tsxCli}. Run npm install from the repo root.`);
  }
  if (!fs.existsSync(prettierCli)) {
    throw new Error(`Missing prettier CLI at ${prettierCli}. Run npm install from the repo root.`);
  }

  const { descriptions, apis } = loadApisAndDescriptions();
  const examples = loadExamples();
  const entries = hookGroupFiles.flatMap((file) =>
    parseHookEntries(fs.readFileSync(path.join(playgroundSrc, file), 'utf8')),
  );

  if (entries.length === 0) {
    throw new Error('No hook entries parsed from playground catalog files.');
  }

  const catalog = entries.map((entry) => {
    const description = descriptions[entry.id];
    if (!description) throw new Error(`Missing description for ${entry.id}`);
    const api = apis[entry.apiExport];
    if (!api) throw new Error(`Missing API export ${entry.apiExport} for ${entry.id}`);
    const example = examples[entry.id];
    if (!example) throw new Error(`Missing example for ${entry.id}`);

    return {
      id: entry.id,
      name: entry.name,
      summary: entry.summary,
      whenToUse: entry.whenToUse,
      category: entry.category,
      ...(entry.tags ? { tags: entry.tags } : {}),
      description,
      api,
      example,
      playgroundUrl: `${playgroundUrl}/${entry.id}`,
      import: `import { ${entry.name} } from 'usethishook';`,
    };
  });

  const ids = new Set(catalog.map((hook) => hook.id));
  if (ids.size !== catalog.length) throw new Error('Duplicate hook ids in catalog.');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  // Stable shape (no timestamps) so `mcp:catalog:check` can diff cleanly in CI.
  fs.writeFileSync(outPath, `${JSON.stringify({ hooks: catalog }, null, 2)}\n`);
  // Match repo Prettier JSON style so CI regenerations don't drift.
  execFileSync(nodeBin, [prettierCli, '--write', outPath], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  console.error(`Wrote ${catalog.length} hooks to ${path.relative(root, outPath)}`);
}

main();
