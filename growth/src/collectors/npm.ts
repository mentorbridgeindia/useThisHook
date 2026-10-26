import { downloadWindows } from '../dates.js';
import type { HttpClient } from '../http.js';
import type { NpmDownloadsWindow, NpmMetrics, SourceResult } from '../types.js';

interface NpmRegistryPackage {
  name: string;
  description?: string;
  homepage?: string;
  license?: string;
  'dist-tags'?: { latest?: string };
  repository?: string | { url?: string };
}

interface NpmDownloadsResponse {
  downloads: number;
  start: string;
  end: string;
}

export async function collectNpmMetrics(
  http: HttpClient,
  packageName: string,
  referenceDate = new Date(),
): Promise<SourceResult<NpmMetrics>> {
  try {
    const windows = downloadWindows(referenceDate);
    const registry = await http.get(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}`,
    );
    if (!registry.ok) return unavailable(`npm registry returned ${registry.status}`);

    const pkg = registry.json<NpmRegistryPackage>();
    const [downloads7d, previousDownloads7d, downloads28d, previousDownloads28d] =
      await Promise.all([
        fetchDownloads(http, packageName, windows.current7),
        fetchDownloads(http, packageName, windows.previous7),
        fetchDownloads(http, packageName, windows.current28),
        fetchDownloads(http, packageName, windows.previous28),
      ]);

    return {
      status: 'ok',
      observed: true,
      data: {
        name: pkg.name,
        version: pkg['dist-tags']?.latest ?? 'unknown',
        description: pkg.description ?? '',
        homepage: pkg.homepage,
        repositoryUrl: normalizeRepoUrl(pkg.repository),
        license: pkg.license,
        downloads7d,
        previousDownloads7d,
        downloads28d,
        previousDownloads28d,
      },
    };
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

async function fetchDownloads(
  http: HttpClient,
  packageName: string,
  window: { start: string; end: string },
): Promise<NpmDownloadsWindow> {
  const url = `https://api.npmjs.org/downloads/point/${window.start}:${window.end}/${encodeURIComponent(packageName)}`;
  const response = await http.get(url);
  if (!response.ok)
    throw new Error(`npm downloads returned ${response.status} for ${window.start}:${window.end}`);
  const body = response.json<NpmDownloadsResponse>();
  return {
    start: body.start ?? window.start,
    end: body.end ?? window.end,
    downloads: body.downloads ?? 0,
  };
}

function normalizeRepoUrl(repository: NpmRegistryPackage['repository']): string | undefined {
  if (!repository) return undefined;
  if (typeof repository === 'string') return repository.replace(/^git\+/, '').replace(/\.git$/, '');
  if (!repository.url) return undefined;
  return repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
}

function unavailable(error: string): SourceResult<NpmMetrics> {
  return { status: 'unavailable', observed: false, error };
}
