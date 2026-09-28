# Release Process

Canonical checklist: [docs/RELEASE.md](https://github.com/senthilkumar979/useThisHook/blob/main/docs/RELEASE.md).

This project uses **manual Keep a Changelog** notes and a **gated** npm publish. There is no publish-on-push or Changesets flow on purpose.

## Steps

1. On a PR to `main`, bump `version` in `package.json` and add a matching section in [`CHANGELOG.md`](https://github.com/senthilkumar979/useThisHook/blob/main/CHANGELOG.md).
2. Merge after CI is green (Node/React matrix and security workflows as configured).
3. Run **Actions → Publish npm → Run workflow** on `main` (OIDC Trusted Publishing, `--provenance`).
4. Create a GitHub Release with tag **`vX.Y.Z`**. Paste the CHANGELOG section as the body.
5. Confirm [npm `usethishook`](https://www.npmjs.com/package/usethishook) shows the new `latest` with provenance.

Do **not** publish from a laptop unless Trusted Publishing is unavailable. Do **not** publish from a git tag push alone.

## Related automation

| Workflow              | Trigger                    | Purpose                           |
| --------------------- | -------------------------- | --------------------------------- |
| `pages.yml`           | Push to `main`             | Deploy playground to GitHub Pages |
| `npm-publish.yml`     | Manual                     | Publish to npm                    |
| `github-packages.yml` | Release / manual           | GitHub Packages mirror            |
| `wiki.yml`            | Push to `main` (`wiki/**`) | Sync in-repo wiki to GitHub Wiki  |

Rollback notes: [docs/ROLLBACK.md](https://github.com/senthilkumar979/useThisHook/blob/main/docs/ROLLBACK.md).
