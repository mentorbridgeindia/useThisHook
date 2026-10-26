import { describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../http.js';
import { collectGithubMetrics } from './github.js';

describe('collectGithubMetrics', () => {
  it('returns ok core metrics and marks traffic unavailable on 403', async () => {
    const http = new HttpClient({
      maxRequests: 10,
      timeoutMs: 1000,
      maxRetries: 0,
      minGithubRateLimitRemaining: 10,
    });

    vi.spyOn(http, 'get').mockImplementation(async (url: string) => {
      if (url.endsWith('/useThisHook')) {
        return jsonResponse({
          full_name: 'senthilkumar979/useThisHook',
          description: 'hooks',
          stargazers_count: 3,
          forks_count: 1,
          open_issues_count: 11,
          watchers_count: 3,
          default_branch: 'main',
          homepage: 'https://usethishook.mentorbridge.in',
          pushed_at: '2026-10-21T03:12:12Z',
        });
      }
      if (url.endsWith('/releases/latest')) {
        return jsonResponse({ tag_name: '1.2.0', published_at: '2026-10-14T00:00:00Z' });
      }
      return {
        ok: false,
        status: 403,
        headers: new Headers(),
        text: 'forbidden',
        json: <T>() => ({}) as T,
      };
    });

    const result = await collectGithubMetrics(http, 'senthilkumar979', 'useThisHook', 'token');
    expect(result.status).toBe('ok');
    expect(result.data?.stars).toBe(3);
    expect(result.data?.latestReleaseTag).toBe('1.2.0');
    expect(result.data?.trafficUnavailableReason).toMatch(/administration permission/);
  });
});

function jsonResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    headers: new Headers(),
    text: JSON.stringify(body),
    json: <T>() => body as T,
  };
}
