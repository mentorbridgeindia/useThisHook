import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { GrowthSnapshot } from '../types.js';

export function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

export function loadSnapshots(dataDir: string): GrowthSnapshot[] {
  if (!existsSync(dataDir)) return [];
  return readdirSync(dataDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(readFileSync(join(dataDir, name), 'utf8')) as GrowthSnapshot);
}

export function latestSnapshot(dataDir: string): GrowthSnapshot | undefined {
  const snapshots = loadSnapshots(dataDir);
  return snapshots.at(-1);
}

export function saveSnapshot(dataDir: string, snapshot: GrowthSnapshot): string {
  ensureDir(dataDir);
  const date = snapshot.collectedAt.slice(0, 10);
  const path = join(dataDir, `${date}.json`);
  writeFileSync(path, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  return path;
}

export function recentTutorialHookIds(snapshots: GrowthSnapshot[], lookback: number): string[] {
  return snapshots
    .slice(-lookback)
    .map((snapshot) => snapshot.tutorialHookId)
    .filter((id): id is string => Boolean(id));
}
