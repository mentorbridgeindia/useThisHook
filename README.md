# useThisHook

**React hooks. Zero runtime dependencies.**

32 named, typed, tree-shakeable hooks for UI, state, forms, lists, overlays, and the browser. You already have React. That is enough.

```bash
npm i usethishook
```

|            |                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------- |
| **npm**    | [npmjs.com/package/usethishook](https://www.npmjs.com/package/usethishook)               |
| **GitHub** | [github.com/senthilkumar979/useThisHook](https://github.com/senthilkumar979/useThisHook) |
| **Docs**   | [usethishook.mentorbridge.in](https://usethishook.mentorbridge.in/)                      |

[![npm](https://img.shields.io/npm/v/usethishook.svg)](https://www.npmjs.com/package/usethishook)
[![license](https://img.shields.io/npm/l/usethishook.svg)](LICENSE)
[![CI](https://github.com/senthilkumar979/useThisHook/actions/workflows/ci.yml/badge.svg)](https://github.com/senthilkumar979/useThisHook/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=senthilkumar979_useThisHook&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=senthilkumar979_useThisHook)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=senthilkumar979_useThisHook&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=senthilkumar979_useThisHook)
[![Known Vulnerabilities](https://snyk.io/test/github/senthilkumar979/useThisHook/badge.svg)](https://snyk.io/test/github/senthilkumar979/useThisHook)
[![bundle size](https://img.shields.io/bundlephobia/minzip/usethishook)](https://bundlephobia.com/package/usethishook)
[![types](https://img.shields.io/npm/types/usethishook.svg)](https://www.npmjs.com/package/usethishook)

The npm name is **`usethishook`**. The product is **useThisHook**. Peers: **React 18+** and **React DOM 18+** (React 19 supported). Confirm, prompt, overlay, and step-flow need `react-dom`.

---

## Why it exists

|                              |                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| **0 runtime dependencies**   | No `dependencies` in the published package. No lodash. No date lib. No extra `node_modules` on your app.  |
| **React is the only peer**   | Hooks sit on `useState`, `useEffect`, and browser APIs.                                                   |
| **Tree-shake by import**     | Named exports, `sideEffects: false`, ESM + CJS + `.d.ts`. Import one hook; leave the rest.                |
| **TypeScript ships with it** | Generated types. No `@types` package. No default export.                                                  |
| **SSR-aware**                | Window, storage, and observers fall back on the server and subscribe after hydration.                     |
| **`await` the UI**           | Confirm, prompt, overlay, file pick, and wizards resolve in the click handler — not in an effect machine. |

Works in Vite, Next.js, CRA, and Module Federation. Same import. Same types.

---

## Usage

```tsx
import { useBoolean, useDebounce, useLocalStorage } from 'usethishook';

export const SearchBox = () => {
  const { value: isOpen, toggle } = useBoolean(false);
  const [query, setQuery] = useLocalStorage('search', '');
  const debouncedQuery = useDebounce(query, 300);

  return (
    <div>
      <button type="button" onClick={toggle}>
        {isOpen ? 'Hide' : 'Show'} search
      </button>
      {isOpen && <input value={query} onChange={(event) => setQuery(event.target.value)} />}
      <p>Searching for: {debouncedQuery}</p>
    </div>
  );
};
```

```tsx
import { useConfirm } from 'usethishook';

export const DeleteButton = () => {
  const { confirm, render } = useConfirm();

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          if (await confirm({ title: 'Delete this row?', danger: true })) {
            // delete
          }
        }}
      >
        Delete
      </button>
      {render()}
    </>
  );
};
```

Put `render()` in the tree once. That is the overlay contract.

Live preview, API, and examples: [usethishook.mentorbridge.in](https://usethishook.mentorbridge.in/).

---

## Hooks

### State

| Hook                 | Purpose                                      | Docs                                                             |
| -------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| `useBoolean`         | Boolean with required `true` / `false` start | [docs](https://usethishook.mentorbridge.in/#/useBoolean)         |
| `useDisclosure`      | Open / close / toggle for menus and dialogs  | [docs](https://usethishook.mentorbridge.in/#/useDisclosure)      |
| `useDebounce`        | Debounce a rapidly changing value            | [docs](https://usethishook.mentorbridge.in/#/useDebounce)        |
| `useInterval`        | Declarative `setInterval` (`null` pauses)    | [docs](https://usethishook.mentorbridge.in/#/useInterval)        |
| `useCopyToClipboard` | Clipboard write + last copied text           | [docs](https://usethishook.mentorbridge.in/#/useCopyToClipboard) |
| `useLocalStorage`    | JSON state persisted in `localStorage`       | [docs](https://usethishook.mentorbridge.in/#/useLocalStorage)    |

### Browser

| Hook                | Purpose                                       | Docs                                                            |
| ------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| `useOnlineStatus`   | `navigator.onLine` plus online/offline events | [docs](https://usethishook.mentorbridge.in/#/useOnlineStatus)   |
| `useMediaQuery`     | Subscribe to a CSS media query                | [docs](https://usethishook.mentorbridge.in/#/useMediaQuery)     |
| `useWindowSize`     | Viewport width and height                     | [docs](https://usethishook.mentorbridge.in/#/useWindowSize)     |
| `useOnClickOutside` | Handler when the user presses outside a ref   | [docs](https://usethishook.mentorbridge.in/#/useOnClickOutside) |
| `useOverlay`        | Promise-based custom overlay                  | [docs](https://usethishook.mentorbridge.in/#/useOverlay)        |
| `useStepFlow`       | Multi-step wizard that resolves when finished | [docs](https://usethishook.mentorbridge.in/#/useStepFlow)       |
| `useAsyncSelect`    | Native file picker as a Promise               | [docs](https://usethishook.mentorbridge.in/#/useAsyncSelect)    |
| `useEventListener`  | DOM / window listener with a stable handler   | [docs](https://usethishook.mentorbridge.in/#/useEventListener)  |
| `useTimeout`        | One-shot timer (`null` pauses)                | [docs](https://usethishook.mentorbridge.in/#/useTimeout)        |
| `useKeyPress`       | Key held down (ignores inputs)                | [docs](https://usethishook.mentorbridge.in/#/useKeyPress)       |

### App

| Hook                   | Purpose                                           | Docs                                                               |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| `useStableCallback`    | Stable function identity, always-latest body      | [docs](https://usethishook.mentorbridge.in/#/useStableCallback)    |
| `useResetState`        | Local state that resets when a source key changes | [docs](https://usethishook.mentorbridge.in/#/useResetState)        |
| `useAsyncAction`       | Pending / error / data around one async action    | [docs](https://usethishook.mentorbridge.in/#/useAsyncAction)       |
| `useDebouncedCallback` | Debounce calling a function                       | [docs](https://usethishook.mentorbridge.in/#/useDebouncedCallback) |
| `useFields`            | Small form object, optional Zod-shaped schema     | [docs](https://usethishook.mentorbridge.in/#/useFields)            |
| `useAmountInput`       | Locale amount field, grouping, cursor restore     | [docs](https://usethishook.mentorbridge.in/#/useAmountInput)       |
| `useList`              | Insert, update, remove, reorder by `id`           | [docs](https://usethishook.mentorbridge.in/#/useList)              |
| `useSelection`         | Single or multi select ids                        | [docs](https://usethishook.mentorbridge.in/#/useSelection)         |
| `useSearchState`       | URL search params as React state                  | [docs](https://usethishook.mentorbridge.in/#/useSearchState)       |
| `useConfirm`           | Await a yes/no dialog                             | [docs](https://usethishook.mentorbridge.in/#/useConfirm)           |
| `usePrompt`            | Await a string from a dialog                      | [docs](https://usethishook.mentorbridge.in/#/usePrompt)            |
| `useControllableState` | Controlled and uncontrolled in one setter         | [docs](https://usethishook.mentorbridge.in/#/useControllableState) |
| `useUnsavedChanges`    | Tab-close warning and in-app leave confirm        | [docs](https://usethishook.mentorbridge.in/#/useUnsavedChanges)    |
| `useElementSize`       | Element size via `ResizeObserver`                 | [docs](https://usethishook.mentorbridge.in/#/useElementSize)       |
| `useInView`            | Element vs viewport via `IntersectionObserver`    | [docs](https://usethishook.mentorbridge.in/#/useInView)            |
| `usePagination`        | Page, offset, next/prev with clamping             | [docs](https://usethishook.mentorbridge.in/#/usePagination)        |

---

## Server rendering

Hooks that read `window`, `document`, `navigator`, or observers are safe to call on the server. They fall back (`false`, `{ width: 0, height: 0 }`, empty query) and subscribe after mount.

`useMediaQuery`, `useWindowSize`, `useOnlineStatus`, `useLocalStorage`, `useSearchState`, `useOnClickOutside`, `useElementSize`, `useInView`, `useUnsavedChanges`, `useEventListener`, `useTimeout`, and `useKeyPress` must not assume a browser until after hydration.

Confirm, prompt, overlay, and step-flow still need `render()` in the client tree.

---

## Local docs and contributing

```bash
npm install
npm test
npm run build
npm run playground
```

Playground: [usethishook.mentorbridge.in](https://usethishook.mentorbridge.in/). Local: `npm run playground` (usually `http://localhost:5173`). Mirror: [GitHub Pages](https://senthilkumar979.github.io/useThisHook/).

| Command                    | What it does                       |
| -------------------------- | ---------------------------------- |
| `npm test`                 | Vitest                             |
| `npm run typecheck`        | Library + playground               |
| `npm run lint`             | ESLint + Prettier                  |
| `npm run build`            | ESM + CJS + types                  |
| `npm run playground:build` | Static docs site                   |
| `npm run verify:commit`    | Secrets, lint, types, tests, build |
| `npm run verify:push`      | Playground build + `npm audit`     |

Husky runs `verify:commit` before commit and `verify:push` before push. Add a hook: [`CONTRIBUTING.md`](CONTRIBUTING.md). Changelog: [`CHANGELOG.md`](CHANGELOG.md).

**Snyk:** [`.github/workflows/snyk.yml`](.github/workflows/snyk.yml) runs `snyk test` on push/PR (high+). Add repo secret **`SNYK_TOKEN`** (Snyk → Account settings → Auth token). Import `senthilkumar979/useThisHook` in the Snyk dashboard so the README / docs badge resolves.

---

## License

[MIT](LICENSE) © 2026 [Senthil Kumar Thangavel](https://senthilkumar.mentorbridge.in). Provided **as is**, without warranty.

[LinkedIn](https://www.linkedin.com/in/senthilk979) · [Issues](https://github.com/senthilkumar979/useThisHook/issues)
