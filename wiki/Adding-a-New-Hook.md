# Adding a New Hook

Follow this checklist when contributing a hook. Full contributor notes live in [CONTRIBUTING.md](https://github.com/senthilkumar979/useThisHook/blob/main/CONTRIBUTING.md).

## Library

1. Create `src/hooks/useYourHook.ts` (or `.tsx`) with a **named export**.
2. Re-export it from `src/index.ts`.
3. Add `src/hooks/useYourHook.test.ts` (or `.tsx`) co-located with the hook.
4. Keep the hook file under **150 lines**, TypeScript-strict, **no new runtime dependency** unless required.
5. Document the hook in the README hook tables (link to `https://usethishook.mentorbridge.in/useYourHook`).

## Playground (required)

Add all of:

- Catalog entry in `stateHooks.ts`, `browserHooks.ts`, `appHooks.ts`, or `leverageHooks.ts`
- Description in `playground/src/descriptions/`
- API spec in `playground/src/api/`
- Demo component and copy-paste example in `playground/src/demos/`

`npm run playground:seo` picks up new `src/hooks/use*.ts(x)` files for the sitemap automatically on the next playground build.

## Local gates

```bash
npm run verify:commit   # secrets, lint, types, coverage, library build
npm run verify:push     # playground build + npm audit (high+)
```

Husky runs these on commit / push. Node **20+** (`engines.node`).

## Pull request

Use the PR template: include tests, playground updates, and README / CHANGELOG when the public API changes.
