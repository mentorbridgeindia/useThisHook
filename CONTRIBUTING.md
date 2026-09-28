# Contributing

Thanks for helping grow **useThisHook** (npm: `usethishook`).
By participating you agree to the [Code of Conduct](.github/CODE_OF_CONDUCT.md).

## Add a hook

1. Create `src/hooks/useYourHook.ts` (or `.tsx`) with a named export.
2. Re-export it from `src/index.ts`.
3. Add `src/hooks/useYourHook.test.ts` (or `.tsx`).
4. Keep the hook file under 150 lines and TypeScript-strict. Do not add a runtime dependency unless the hook cannot work without it.
5. Document it in the README hook table (docs URL: `https://usethishook.mentorbridge.in/useYourHook`).
6. Playground (all of these):
   - Catalog entry (`stateHooks.ts`, `browserHooks.ts`, `appHooks.ts`, or `leverageHooks.ts`).
   - Description in `playground/src/descriptions/`.
   - API spec in `playground/src/api/`.
   - Demo component and copy-paste example string in `playground/src/demos/`.

Maintainer docs (architecture, release, testing) live in the [GitHub Wiki](https://github.com/senthilkumar979/useThisHook/wiki); sources are in-repo under `wiki/`.

## Checks

After `npm install`, Husky runs the same gates locally:

- **pre-commit** (`npm run verify:commit`): secret scan, lint, typecheck, tests, library build
- **pre-push** (`npm run verify:push`): playground production build, `npm audit` (high+)

CI uses `verify:commit` plus `playground:build`. Skip hooks only if you must: `HUSKY=0 git commit` / `HUSKY=0 git push`.

```bash
npm run verify:commit
npm run verify:push
```

Node 20 or later (`engines.node`).

## Publish

Do not publish from your laptop unless you must. Follow [`docs/RELEASE.md`](docs/RELEASE.md): bump SemVer + CHANGELOG, merge to `main`, then **Actions → Publish npm**, then create GitHub Release **`vX.Y.Z`**.

Rollback / deprecation: [`docs/ROLLBACK.md`](docs/ROLLBACK.md).

## Maintainer checklist (GitHub settings)

These are configured in the GitHub UI (see [`docs/RELEASE.md`](docs/RELEASE.md)):

1. Protect `main` (PR required, required checks, no force-push).
2. Enable **Private vulnerability reporting**.
3. Confirm CodeQL and Scorecard results under the Security tab after the workflows run.
