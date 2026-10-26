import type { HttpClient } from '../http.js';
import type { GithubMetrics, SourceResult } from '../types.js';

interface GithubRepoResponse {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  homepage: string | null;
  pushed_at: string;
}

interface GithubReleaseResponse {
  tag_name: string;
  published_at: string;
}

interface GithubTrafficViews {
  count: number;
}

interface GithubTrafficClones {
  count: number;
}

export async function collectGithubMetrics(
  http: HttpClient,
  owner: string,
  repo: string,
  token?: string,
): Promise<SourceResult<GithubMetrics>> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'usethishook-growth-agent',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const repoResponse = await http.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
    });
    if (!repoResponse.ok) return unavailable(`GitHub repo API returned ${repoResponse.status}`);

    const repoBody = repoResponse.json<GithubRepoResponse>();
    let latestReleaseTag: string | null = null;
    let latestReleasePublishedAt: string | null = null;

    try {
      const releaseResponse = await http.get(
        `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
        { headers },
      );
      if (releaseResponse.ok) {
        const release = releaseResponse.json<GithubReleaseResponse>();
        latestReleaseTag = release.tag_name;
        latestReleasePublishedAt = release.published_at;
      }
    } catch {
      // Optional enrichment; keep core repo metrics.
    }

    const traffic = await maybeCollectTraffic(http, owner, repo, headers);

    return {
      status: 'ok',
      observed: true,
      data: {
        fullName: repoBody.full_name,
        description: repoBody.description,
        stars: repoBody.stargazers_count,
        forks: repoBody.forks_count,
        openIssues: repoBody.open_issues_count,
        watchers: repoBody.watchers_count,
        defaultBranch: repoBody.default_branch,
        homepage: repoBody.homepage,
        pushedAt: repoBody.pushed_at,
        latestReleaseTag,
        latestReleasePublishedAt,
        ...traffic,
      },
    };
  } catch (error) {
    return unavailable(error instanceof Error ? error.message : String(error));
  }
}

async function maybeCollectTraffic(
  http: HttpClient,
  owner: string,
  repo: string,
  headers: Record<string, string>,
): Promise<Pick<GithubMetrics, 'trafficViews' | 'trafficClones' | 'trafficUnavailableReason'>> {
  try {
    const viewsResponse = await http.get(
      `https://api.github.com/repos/${owner}/${repo}/traffic/views`,
      { headers },
    );
    if (viewsResponse.status === 401 || viewsResponse.status === 403) {
      return {
        trafficUnavailableReason:
          'Traffic stats require an authenticated token with repository administration permission; treating as unavailable.',
      };
    }
    if (!viewsResponse.ok)
      return { trafficUnavailableReason: `Traffic views returned ${viewsResponse.status}` };

    const clonesResponse = await http.get(
      `https://api.github.com/repos/${owner}/${repo}/traffic/clones`,
      { headers },
    );
    const views = viewsResponse.json<GithubTrafficViews>();
    const clones = clonesResponse.ok ? clonesResponse.json<GithubTrafficClones>() : { count: 0 };
    return {
      trafficViews: views.count,
      trafficClones: clones.count,
    };
  } catch (error) {
    return {
      trafficUnavailableReason: error instanceof Error ? error.message : String(error),
    };
  }
}

function unavailable(error: string): SourceResult<GithubMetrics> {
  return { status: 'unavailable', observed: false, error };
}
