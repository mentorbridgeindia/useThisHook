# Versioning Policy

**useThisHook** follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/).

Bump `package.json` `version` in the **same change** as the matching `CHANGELOG.md` section.

## What each bump means

| Bump      | When                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **MAJOR** | Breaking public API: removed/renamed exports, required args that were optional, behavior changes that break typical call sites |
| **MINOR** | New hooks or additive options/return fields that are backward compatible                                                       |
| **PATCH** | Bug fixes, docs-only publish if packaged, typing fixes that do not change runtime intent                                       |

## Stability notes

- **`1.x`** is the first stable line. Removals from `0.3.0` are documented in [docs/MIGRATION.md](https://github.com/senthilkumar979/useThisHook/blob/main/docs/MIGRATION.md).
- Playground-only changes do not require a package version bump unless the npm README or published files change.
- Security fixes target the **latest** published release; older lines are not patched separately (see [Security](Security)).

## Pre-1.0 history

`0.x` releases could remove hooks more aggressively. From `1.0.0` onward, removals are major bumps.
