# Roadmap

Honest near-term direction for **useThisHook**. Not a commitment calendar.

## Near term

- Keep CI trust signals green (Scorecard, CodeQL, Snyk, Sonar, Codecov, publint/attw)
- Flesh out docs demos where API edges are still thin
- Raise unit-test coverage on remaining branch gaps
- Run the owner checklist in [docs/GROWTH.md](docs/GROWTH.md) (Topics, Discussions, content, distribution)
- Keep `usethishook-mcp` catalog in lockstep with playground docs (shipped in 1.3.0)

## Later

- More form / list helpers that stay zero-runtime-deps
- Optional recipe docs (Next.js App Router, MFE hosts)

## Non-goals

- Runtime dependencies inside the published package
- A large “kitchen sink” UI kit — hooks only
- Playwright E2E as a gate (Vitest covers the library API)
- Changesets / publish-on-every-tag (releases stay manually gated)

See [docs/RELEASE.md](docs/RELEASE.md) for how versions ship.
