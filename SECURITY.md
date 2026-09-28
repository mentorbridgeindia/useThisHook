# Security Policy

## Supported versions

Security fixes are applied to the latest published `usethishook` release on npm. Older versions are not patched separately; upgrade to the latest version when a fix is released.

## What counts as a vulnerability

Please report issues that could reasonably harm users of this library, including:

- Logic that exposes private data across origins, storage keys, or sessions unexpectedly
- XSS or unsafe HTML/script injection introduced by a hook’s public API
- Prototype pollution or unsafe object merging in public helpers
- Dependency or supply-chain issues in the **published** package (runtime or types shipped in the npm tarball)

Out of scope for private disclosure (prefer a normal GitHub issue):

- Documentation or playground-only bugs that do not affect the published package
- Feature requests and API design feedback
- DevDependency advisories that only affect local `vite` / `tsup` tooling and do not ship in the npm tarball (still welcome as ordinary issues)

## How to report a vulnerability

Do **not** open a public GitHub issue for security reports.

1. Use GitHub’s private vulnerability reporting for this repository:  
   [Report a vulnerability](https://github.com/senthilkumar979/useThisHook/security/advisories/new)
2. If private reporting is unavailable, email **mentorbridgeindia@gmail.com** with:
   - A clear description of the issue and impact
   - Steps to reproduce (minimal reproduction preferred)
   - Affected package version(s)
   - Any suggested fix, if you have one

We follow [coordinated vulnerability disclosure](https://github.com/ossf/oss-risk-assessment/blob/main/coordinated_vulnerability_disclosure.md): please allow time for a fix before public discussion.

## Response expectations

- **Acknowledgement:** within 7 days
- **Status update:** within 14 days of acknowledgement
- **Fix / advisory:** as soon as practical for confirmed issues; we will credit reporters who want attribution

## Hardening already in place

- Zero runtime dependencies in the published package
- CI with lint, typecheck, tests, coverage, SonarCloud, Snyk, and OpenSSF Scorecard
- npm publish via trusted publishing (OIDC), not a long-lived token in CI

This project is a typed React hooks library. Continuous fuzzing (OSS-Fuzz / ClusterFuzzLite) is not a practical fit; quality is enforced with Vitest unit tests and static analysis instead.
