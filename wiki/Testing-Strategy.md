# Testing Strategy

## Stack

| Tool                | Role                                    |
| ------------------- | --------------------------------------- |
| **Vitest**          | Runner (`vitest.config.ts`)             |
| **jsdom**           | DOM environment                         |
| **Testing Library** | `renderHook`, `render`, `screen`, `act` |
| **v8 coverage**     | `npm run test:coverage` → Codecov in CI |

Tests live next to hooks: `src/hooks/*.test.ts` / `.tsx`. Playground code is **not** unit-tested; it is validated by `playground:build` in CI and on pre-push.

## What to cover

- Happy path return values and option defaults
- SSR / no-`window` defaults where relevant
- Effect cleanup (listeners, intervals, observers)
- Async dialogs: render `render()` from the hook and assert UI + promise resolution
- Edge cases: empty lists, paused timers (`null` delay), invalid keys

Prefer behavior over implementation details. Do not assert internal refs or private module state.

## Gates

- **pre-commit / CI:** `verify:commit` runs `test:coverage` (and lint, typecheck, build)
- **Codecov:** uploads `coverage/lcov.info` from CI
- There is **no Playwright / E2E** suite — browser APIs are exercised under jsdom where practical

## Commands

```bash
npm test
npm run test:coverage
npm run test:watch
```
