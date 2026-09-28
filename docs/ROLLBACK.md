# Rollback and deprecation

## Prefer deprecate over unpublish

If a published version is broken or unsafe:

1. Publish a fixed SemVer release as soon as possible (patch or minor as appropriate).
2. Deprecate the bad version on npm so installs warn:

```bash
npm deprecate usethishook@X.Y.Z "Reason and upgrade path (use >=A.B.C)."
```

3. Document the issue in [`CHANGELOG.md`](../CHANGELOG.md) and, for security issues, a GitHub Security Advisory ([`SECURITY.md`](../SECURITY.md)).

**Avoid `npm unpublish`** for versions older than 72 hours or that others may depend on. Unpublishing breaks the public registry graph; deprecate instead.

## Hotfix SemVer

| Situation                       | Action                                          |
| ------------------------------- | ----------------------------------------------- |
| Bug in latest, API unchanged    | Patch release (`1.0.x`)                         |
| Safe additive fix needed widely | Patch or minor                                  |
| Breaking fix required           | Major (or clearly documented deprecate + major) |

Follow the normal [release process](RELEASE.md) for hotfixes: CHANGELOG entry, merge, **Publish npm**, GitHub Release tag.

## Yank / emergency

Only consider unpublish when:

- The version was published minutes ago, and
- You are certain no consumer has locked it, and
- npm’s unpublish rules still allow it

Otherwise: deprecate + ship a fixed release.
