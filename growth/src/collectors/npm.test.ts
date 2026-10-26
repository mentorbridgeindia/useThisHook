import { describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../http.js';
import { collectNpmMetrics } from './npm.js';

describe('collectNpmMetrics', () => {
  it('returns ok metrics from registry and download windows', async () => {
    const http = new HttpClient({
      maxRequests: 10,
      timeoutMs: 1000,
      maxRetries: 0,
      minGithubRateLimitRemaining: 10,
    });

    vi.spyOn(http, 'get').mockImplementation(async (url: string) => {
      if (url.includes('registry.npmjs.org')) {
        return jsonResponse({
          name: 'usethishook',
          description: 'hooks',
          homepage: 'https://usethishook.mentorbridge.in',
          license: 'MIT',
          'dist-tags': { latest: '1.2.0' },
          repository: { url: 'git+https://github.com/senthilkumar979/useThisHook.git' },
        });
      }
      return jsonResponse({ downloads: 12, start: '2026-10-01', end: '2026-10-07' });
    });

    const result = await collectNpmMetrics(http, 'usethishook', new Date('2026-10-26T00:00:00Z'));
    expect(result.status).toBe('ok');
    expect(result.data?.version).toBe('1.2.0');
    expect(result.data?.downloads7d.downloads).toBe(12);
  });

  it('returns unavailable when registry fails', async () => {
    const http = new HttpClient({
      maxRequests: 5,
      timeoutMs: 1000,
      maxRetries: 0,
      minGithubRateLimitRemaining: 10,
    });
    vi.spyOn(http, 'get').mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers(),
      text: 'error',
      json: <T>() => ({}) as T,
    });
    const result = await collectNpmMetrics(http, 'usethishook');
    expect(result.status).toBe('unavailable');
  });
});

function jsonResponse(body: unknown) {
  const text = JSON.stringify(body);
  return {
    ok: true,
    status: 200,
    headers: new Headers(),
    text,
    json: <T>() => body as T,
  };
}
