# usethishook growth agent

Weekly GitHub Actions agent that collects public adoption metrics, audits docs, and drafts one human-reviewed React tutorial for [`usethishook`](https://www.npmjs.com/package/usethishook).

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the module design.

## Quick start

```bash
npm run growth:install
npm run growth:test
npm run growth:build
GROWTH_PUBLISH=false npm run growth:run
```

Local runs write:

- `growth/reports/YYYY-MM-DD.md`
- `growth/data/snapshots/YYYY-MM-DD.json`

They do **not** open GitHub issues unless `GROWTH_PUBLISH=true`.

## Configuration

Edit [growth.config.json](./growth.config.json):

| Field                          | Purpose                                                      |
| ------------------------------ | ------------------------------------------------------------ |
| `packageName`                  | npm package to measure (`usethishook`)                       |
| `github.owner` / `github.repo` | Public GitHub repository                                     |
| `siteUrl`                      | Docs/playground origin                                       |
| `limits.*`                     | Request, retry, LLM, and PR caps                             |
| `pullRequests.enabled`         | Keep `false` unless you intentionally enable narrow docs PRs |
| `content.installCommand`       | Install snippet used in drafts                               |

## Environment variables

| Variable                   | Required        | Description                                                                                                     |
| -------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| `GROWTH_PUBLISH`           | no              | Set `true` in Actions to create/update the weekly issue                                                         |
| `GITHUB_TOKEN`             | Actions default | Used for GitHub API + issue publish                                                                             |
| `GSC_SERVICE_ACCOUNT_JSON` | no              | Full Google service-account JSON string                                                                         |
| `GSC_SITE_URL`             | no              | Search Console property, e.g. `sc-domain:usethishook.mentorbridge.in` or `https://usethishook.mentorbridge.in/` |
| `LLM_BASE_URL`             | no              | OpenAI-compatible base URL ending before `/chat/completions`                                                    |
| `LLM_MODEL`                | no              | Model id for the free-tier provider you choose                                                                  |
| `LLM_API_KEY`              | no              | API key for the optional LLM provider                                                                           |
| `GROWTH_DATA_BRANCH`       | no              | Defaults to `growth-data`                                                                                       |

Never commit secrets. Store them in GitHub Actions secrets. Logs redact bearer tokens and configured secret values.

## Enable Google Search Console

1. Verify the docs site in [Google Search Console](https://search.google.com/search-console).
2. Create a Google Cloud service account with **Search Console API** enabled.
3. Add the service account email as a Search Console user with read access to the property.
4. Download the JSON key and store the entire JSON as `GSC_SERVICE_ACCOUNT_JSON`.
5. Store the property URL as `GSC_SITE_URL`.
6. Re-run the `Growth` workflow. If unset, the report records `gsc: not configured` and continues.

## Optional LLM provider

Any OpenAI-compatible free-tier endpoint works:

```bash
LLM_BASE_URL=https://api.example.com/v1
LLM_MODEL=your-free-model
LLM_API_KEY=...
```

Safeguards:

- one call per run
- 20s timeout
- capped output tokens
- draft discarded unless every mentioned `use*` hook exists in `mcp/data/catalog.json` and the playground URL matches

If the key is missing or validation fails, the deterministic catalog-based draft is used.

## Deterministic no-LLM fallback

Without an LLM, the agent still:

1. rotates one unused catalog hook by ISO week
2. copies the verified example and playground URL
3. writes LinkedIn + community drafts marked for human review

## Cost and security

- Public npm + GitHub APIs are free; Search Console and LLM free tiers are optional and may change.
- Request budget: 25 / run.
- GitHub traffic endpoints may 403 without admin permission; that is recorded as unavailable, not a hard failure.
- Secrets are never printed.
- No automatic social posting, npm publish, or PR merge.

## GitHub Actions

Workflow: [../.github/workflows/growth.yml](../.github/workflows/growth.yml)

- Schedule: Mondays 06:00 UTC
- Manual: `workflow_dispatch`
- Publishes the weekly issue when `GROWTH_PUBLISH=true`
- Commits reports/snapshots to `growth-data`

## Sample report

A real public-data sample from a local dry run is checked in at [`reports/2026-10-26.md`](./reports/2026-10-26.md), with the matching snapshot in [`data/snapshots/2026-10-26.json`](./data/snapshots/2026-10-26.json).
