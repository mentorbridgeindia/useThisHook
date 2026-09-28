# Release process

This project uses **manual Keep a Changelog** notes and a **gated** npm publish. There is no Changesets / publish-on-push flow on purpose.

## Checklist for every release

1. On a PR to `main`, bump `version` in `package.json` and add a matching section in [`CHANGELOG.md`](../CHANGELOG.md).
2. Merge the PR after CI is green (Node/React matrix, CodeQL, Sonar, Snyk as configured).
3. Run **Actions → Publish npm → Run workflow** on `main`. Publish uses OIDC Trusted Publishing and `--provenance`.
4. Create a GitHub Release with tag **`vX.Y.Z`** (same version). Paste the CHANGELOG section as the body.
5. Confirm on [npmjs.com/package/usethishook](https://www.npmjs.com/package/usethishook) that `latest` is `X.Y.Z` and provenance is shown.

Do **not** publish from a laptop unless Trusted Publishing is unavailable. Do **not** publish from a git tag push.

## Maintainer GitHub settings

Configure these once (Settings UI; not stored in the repo):

| Setting                             | Recommendation                                                                            |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| **Branch protection** on `main`     | Require a PR, require status checks (`CI` library + playground, CodeQL), block force-push |
| **Private vulnerability reporting** | Enable under Code security and analysis                                                   |
| **Code scanning**                   | CodeQL + Scorecard SARIF uploads should appear under Security                             |

See also [`ROLLBACK.md`](ROLLBACK.md) and [`../SECURITY.md`](../SECURITY.md).
