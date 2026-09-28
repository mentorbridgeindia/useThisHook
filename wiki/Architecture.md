# Architecture

## Library package

```
src/
  hooks/          # One module per hook (+ shared dialogFrame for overlays)
  index.ts        # Public barrel — named re-exports only
tsup.config.ts    # ESM + CJS + .d.ts / .d.cts from src/index.ts
```

- **Tree-shaking:** `sideEffects: false` and named exports so bundlers drop unused hooks.
- **Peers only:** published tarball peers on `react` / `react-dom` (`>=18`). No runtime dependencies.
- **Build:** `tsup` emits `dist/index.js`, `dist/index.cjs`, and matching types. `react` is marked `external`.
- **Entry:** consumers import from `usethishook` (see `package.json` `exports`).

## Playground (docs site)

The interactive site under `playground/` is the public docs surface at [usethishook.mentorbridge.in](https://usethishook.mentorbridge.in/).

| Concern              | Location                                       |
| -------------------- | ---------------------------------------------- |
| Catalog / categories | `playground/src/*Hooks.ts`, `hooksCatalog.ts`  |
| Descriptions         | `playground/src/descriptions/`                 |
| API tables           | `playground/src/api/`                          |
| Live demos           | `playground/src/demos/`                        |
| Routing              | Path-based History API (`/`, `/useBoolean`, …) |

The playground resolves the library via a Vite alias to `../src/index.ts` so demos track local source without publishing.

## Deployments

| Target                 | How                                                                               |
| ---------------------- | --------------------------------------------------------------------------------- |
| Custom domain / Vercel | `npm run playground:build` (`base: /`)                                            |
| GitHub Pages           | `npm run playground:build:pages` (`base: /useThisHook/`, `404.html` SPA fallback) |
| npm                    | Manual **Publish npm** workflow (OIDC)                                            |

## Related docs in the repo

- [CONTRIBUTING.md](https://github.com/senthilkumar979/useThisHook/blob/main/CONTRIBUTING.md)
- [docs/RELEASE.md](https://github.com/senthilkumar979/useThisHook/blob/main/docs/RELEASE.md)
- [docs/MIGRATION.md](https://github.com/senthilkumar979/useThisHook/blob/main/docs/MIGRATION.md)
