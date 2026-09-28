# Security

The canonical policy is in the repository: [SECURITY.md](https://github.com/senthilkumar979/useThisHook/blob/main/SECURITY.md).

## Report a vulnerability

Do **not** open a public issue for security reports.

1. Prefer GitHub [private vulnerability reporting](https://github.com/senthilkumar979/useThisHook/security/advisories/new).
2. Or email **mentorbridgeindia@gmail.com** with impact, reproduction, and affected versions.

## Scope (summary)

In scope: issues that can harm consumers of the **published** package (data exposure, XSS via public APIs, prototype pollution, supply-chain issues in the npm tarball).

Out of scope for private disclosure: playground-only bugs, feature requests, and most DevDependency advisories that never ship in the package.

## Hardening already in place

- Zero runtime dependencies in the published package
- CI: lint, typecheck, tests, coverage, SonarCloud, Snyk, OpenSSF Scorecard
- npm publish via OIDC Trusted Publishing (no long-lived npm token in CI)
