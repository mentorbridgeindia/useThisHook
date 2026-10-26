import { createSign } from 'node:crypto';
import { addDays, toIsoDate } from '../dates.js';
import type { HttpClient } from '../http.js';
import type { GscMetrics, SourceResult } from '../types.js';

interface ServiceAccountJson {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface SearchAnalyticsResponse {
  rows?: Array<{
    keys?: string[];
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  }>;
}

export async function collectGscMetrics(
  http: HttpClient,
  serviceAccountJson: string | undefined,
  siteUrl: string | undefined,
  referenceDate = new Date(),
): Promise<SourceResult<GscMetrics>> {
  if (!serviceAccountJson || !siteUrl)
    return { status: 'not_configured', observed: false, error: 'GSC credentials not configured' };

  try {
    const account = JSON.parse(serviceAccountJson) as ServiceAccountJson;
    if (!account.client_email || !account.private_key)
      return unavailable('GSC service account JSON missing client_email or private_key');

    const accessToken = await fetchAccessToken(http, account);
    const endDate = toIsoDate(addDays(referenceDate, -1));
    const startDate = toIsoDate(addDays(referenceDate, -28));
    const encodedSite = encodeURIComponent(siteUrl);
    const response = await http.post(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 25,
        }),
      },
    );

    if (!response.ok) return unavailable(`Search Console API returned ${response.status}`);

    const body = response.json<SearchAnalyticsResponse>();
    const rows = (body.rows ?? []).map((row) => ({
      keys: row.keys ?? [],
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }));

    return {
      status: 'ok',
      observed: true,
      data: {
        siteUrl,
        startDate,
        endDate,
        rows,
        totalClicks: rows.reduce((sum, row) => sum + row.clicks, 0),
        totalImpressions: rows.reduce((sum, row) => sum + row.impressions, 0),
      },
    };
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

async function fetchAccessToken(http: HttpClient, account: ServiceAccountJson): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(
    JSON.stringify({
      iss: account.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: account.token_uri ?? 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = base64Url(signer.sign(account.private_key));
  const assertion = `${unsigned}.${signature}`;

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await http.post(account.token_uri ?? 'https://oauth2.googleapis.com/token', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) throw new Error(`GSC token exchange returned ${response.status}`);
  return response.json<TokenResponse>().access_token;
}

function base64Url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function unavailable(error: string): SourceResult<GscMetrics> {
  return { status: 'unavailable', observed: false, error };
}
