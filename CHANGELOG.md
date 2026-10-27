# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Bump `version` in `package.json` in the same change as the notes below, then follow
[`docs/RELEASE.md`](docs/RELEASE.md): **Actions → Publish npm**, then GitHub Release **vX.Y.Z**.
Do not publish from a push or tag.

## [Unreleased]

## [1.3.0] - 2026-10-27

### Added

- `useAsyncState` — idle / loading / success / error with abort and optional immediate fetch
- `useOptimisticAction` — optimistic update with rollback and duplicate-submit guard
- `useRetry` — retries, constant or exponential backoff, and cancel
- `useAsyncQueue` — FIFO async tasks with a concurrency cap
- `usePolling` — interval polling that pauses when the tab is hidden
- `useOnlineQueue` — in-memory outbox that flushes when the browser is online
- `useStorageQuota` — `navigator.storage.estimate()` usage and quota
- `useInstallPrompt` — PWA `beforeinstallprompt` capture and `prompt()`
- `useCrossTabState` — JSON state synced across tabs (BroadcastChannel + storage)
- `useRenderTracker` — render counts; `console.debug` in development
- `useWhyDidYouUpdate` — log which snapshot keys changed between renders
- `useKeyboardShortcut` — window key combos with cleanup
- `useLongPress` — mouse and touch press-and-hold handlers
- `usethishook-mcp@1.3.0` — catalog covers all 53 hooks (`list_hooks`, `search_hooks`, `get_hook`, `recommend_hook`). See [mcp/README.md](mcp/README.md).

### Docs

- Playground comparison page vs usehooks-ts / react-use, MCP setup page, unique-hook spotlight
- Per-route HTML titles/descriptions for crawlers; StackBlitz and CodeSandbox try-online links on every hook page

## [1.2.0] - 2026-10-14

### Added

- `useSessionStorage` — JSON state in `sessionStorage` (same shape as `useLocalStorage`)
- `useThrottle` — throttle a value (leading + trailing)
- `useThrottledCallback` — throttle a function, with cancel
- `useScrollLock` — lock / unlock `document.body` scroll for overlays
- `useDocumentVisibility` — Page Visibility API (`visible` | `hidden`)
- `useIdle` — true after a period of no user activity
- `useUpdateEffect` — like `useEffect`, but skips the initial mount and runs only on later dependency changes
- `useAmountInput` optional `locales` map to register or override language separators beyond built-in `en` / `de` / `nl` / `fr`
- Exported `AmountLocaleConfig` type

## [1.1.0] - 2026-10-06

### Added

- `useFingerprint(options?)` — client-side visitor id from browser signals (canvas, WebGL, screen, locale, storage). Returns `{ visitorId, components, isPending, error, refresh }`. Zero network calls; not the commercial Fingerprint Identification SaaS.

## [1.0.0] - 2026-09-28

### Added

- First **stable** SemVer release (1.0.0). Runtime API matches 0.4.0; breaking removals already shipped in 0.3.0.
- Nested `exports` conditions (`import` / `require` each with `types` + `default`) and `typings` for broader TypeScript / ESM detectors
- Vitest coverage (`@vitest/coverage-v8`), Codecov upload from CI, and Codecov badge
- Legacy GitHub commit status (`ci/tests`) from CI for analyzers that do not read Check Runs

### Changed

- `verify:commit` runs `test:coverage` so coverage is produced on every local verify and CI run

## [0.3.0] - 2026-09-13

### Added

- `useBoolean(initialValue: boolean)` — required `true` or `false`, plus `toggle`, `setTrue`, `setFalse`, `setValue`
- Husky **pre-commit** (`verify:commit`) and **pre-push** (`verify:push`) so lint, types, tests, build, playground build, and `npm audit` run before CI or publish

### Removed

- `useToggle`, `useCounter`, `usePrevious`, `useDocumentTitle`, `useHover`, `usePreferredColorScheme`, `useOnChange`

## [0.2.0] - 2026-09-12

### Added

- `useEventListener` — window / document / node / ref listener with a stable handler
- `useTimeout` — one-shot delay (`null` pauses)
- `useHover` — `{ ref, isHovered }`
- `useKeyPress` — key held down; ignores editable fields
- `usePreferredColorScheme` — OS `light` | `dark` via `matchMedia`
- Playground **Home** control in the sidebar
- Smooth-scroll to top when changing playground routes
- Radix Scroll Area on the playground sidebar hook list

## [0.1.1] - 2026-09-12

### Changed

- `repository` and `bugs` URLs use the camelCase GitHub repo `useThisHook`.
- Playground GitHub Pages build uses relative asset URLs so `/useThisHook/` loads scripts.

## [0.1.0] - 2026-09-12

### Added

- First public release of `usethishook` with state, browser, and app hooks.
- Playground documentation with live previews and API reference.
