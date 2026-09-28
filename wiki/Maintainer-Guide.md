# Maintainer Guide

Practical notes for people with write access to the repo.

## Local development

```bash
npm install
npm run playground          # docs site
npm run verify:commit       # pre-commit gate
npm run verify:push         # pre-push gate
```

Husky wires those scripts. Skip only when necessary: `HUSKY=0 git commit` / `HUSKY=0 git push`.

## CI & quality

| Area                     | Location                                      |
| ------------------------ | --------------------------------------------- |
| Library + playground CI  | `.github/workflows/ci.yml`                    |
| Pages deploy             | `.github/workflows/pages.yml`                 |
| npm publish              | `.github/workflows/npm-publish.yml`           |
| Wiki sync                | `.github/workflows/wiki.yml`                  |
| Dependabot               | `.github/dependabot.yml`                      |
| Scorecard / Snyk / Sonar | matching workflows under `.github/workflows/` |

## Releases

See [Release Process](Release-Process) and [docs/RELEASE.md](https://github.com/senthilkumar979/useThisHook/blob/main/docs/RELEASE.md).

## GitHub Wiki sync

Wiki **source of truth** is the `wiki/` folder in this repository. On push to `main` (paths under `wiki/**`), `wiki.yml` copies those Markdown files to `useThisHook.wiki.git`.

**First-time setup:** enable the Wiki once in the GitHub repo UI (create an empty Home page if prompted). After that, edits should land in `wiki/` via PR so they stay reviewed and versioned.

Manual sync: **Actions → Sync GitHub Wiki → Run workflow**.

## One-time GitHub settings

| Setting                         | Recommendation                                   |
| ------------------------------- | ------------------------------------------------ |
| Branch protection on `main`     | PR required; status checks for CI; no force-push |
| Private vulnerability reporting | Enabled                                          |
| npm Trusted Publishing          | Linked to the Publish npm workflow               |

## SEO / playground

- Path routes (`/useBoolean`); legacy `#/useBoolean` redirects client-side
- `npm run playground:seo` regenerates `robots.txt` and `sitemap.xml` before builds
- Custom domain canonical: `https://usethishook.mentorbridge.in`
