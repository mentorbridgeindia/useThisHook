import { redactSecrets, safeWarn } from './redact.js';

export interface HttpClientOptions {
  maxRequests: number;
  timeoutMs: number;
  maxRetries: number;
  minGithubRateLimitRemaining: number;
  secretsToRedact?: string[];
}

export interface HttpResponse {
  ok: boolean;
  status: number;
  headers: Headers;
  text: string;
  json: <T>() => T;
}

export class HttpBudgetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HttpBudgetError';
  }
}

export class HttpClient {
  private requestCount = 0;
  private githubRateLimitRemaining: number | null = null;

  constructor(private readonly options: HttpClientOptions) {}

  getRequestCount(): number {
    return this.requestCount;
  }

  getGithubRateLimitRemaining(): number | null {
    return this.githubRateLimitRemaining;
  }

  async get(url: string, init: RequestInit = {}): Promise<HttpResponse> {
    return this.request(url, { ...init, method: 'GET' });
  }

  async post(url: string, init: RequestInit = {}): Promise<HttpResponse> {
    return this.request(url, { method: 'POST', ...init });
  }

  async patch(url: string, init: RequestInit = {}): Promise<HttpResponse> {
    return this.request(url, { method: 'PATCH', ...init });
  }

  async request(url: string, init: RequestInit): Promise<HttpResponse> {
    if (this.requestCount >= this.options.maxRequests)
      throw new HttpBudgetError(`HTTP request budget exceeded (${this.options.maxRequests})`);

    if (url.includes('api.github.com') && this.githubRateLimitRemaining !== null) {
      if (this.githubRateLimitRemaining < this.options.minGithubRateLimitRemaining)
        throw new HttpBudgetError(
          `GitHub rate limit remaining too low (${this.githubRateLimitRemaining})`,
        );
    }

    return this.requestWithRetry(url, init, 0);
  }

  private async requestWithRetry(
    url: string,
    init: RequestInit,
    attempt: number,
  ): Promise<HttpResponse> {
    this.requestCount += 1;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.options.timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      const text = await response.text();
      this.captureGithubRateLimit(url, response.headers);

      if (this.shouldRetry(response.status) && attempt < this.options.maxRetries) {
        await sleep(250 * (attempt + 1));
        return this.requestWithRetry(url, init, attempt + 1);
      }

      return {
        ok: response.ok,
        status: response.status,
        headers: response.headers,
        text,
        json: <T>() => JSON.parse(text) as T,
      };
    } catch (error) {
      if (attempt >= this.options.maxRetries) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          redactSecrets(`Request failed for ${url}: ${message}`, this.options.secretsToRedact),
          { cause: error },
        );
      }
      await sleep(250 * (attempt + 1));
      return this.requestWithRetry(url, init, attempt + 1);
    } finally {
      clearTimeout(timer);
    }
  }

  private shouldRetry(status: number): boolean {
    return status === 429 || status >= 500;
  }

  private captureGithubRateLimit(url: string, headers: Headers): void {
    if (!url.includes('api.github.com')) return;
    const remaining = headers.get('x-ratelimit-remaining');
    if (remaining == null) return;
    const parsed = Number(remaining);
    if (!Number.isFinite(parsed)) return;
    this.githubRateLimitRemaining = parsed;
    if (parsed < this.options.minGithubRateLimitRemaining)
      safeWarn(`GitHub rate limit remaining is low: ${parsed}`, this.options.secretsToRedact);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
