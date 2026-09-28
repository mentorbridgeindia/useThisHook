# useThisHook

**React hooks. Zero runtime dependencies.**

32 typed, tree-shakeable hooks for state, browser APIs, forms, lists, and promise-based dialogs. Install once; import only what you need.

```bash
npm i usethishook
```

[Docs & live demos](https://usethishook.mentorbridge.in/) · [Wiki](https://github.com/senthilkumar979/useThisHook/wiki) · [npm](https://www.npmjs.com/package/usethishook) · [Changelog](CHANGELOG.md) · [Support](SUPPORT.md) · [Security](SECURITY.md)

[![npm](https://img.shields.io/npm/v/usethishook.svg)](https://www.npmjs.com/package/usethishook)
[![license](https://img.shields.io/npm/l/usethishook.svg)](LICENSE)
[![CI](https://github.com/senthilkumar979/useThisHook/actions/workflows/ci.yml/badge.svg)](https://github.com/senthilkumar979/useThisHook/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/senthilkumar979/useThisHook/graph/badge.svg)](https://codecov.io/gh/senthilkumar979/useThisHook)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/senthilkumar979/useThisHook/badge)](https://scorecard.dev/viewer/?uri=github.com/senthilkumar979/useThisHook)
[![types](https://img.shields.io/npm/types/usethishook.svg)](https://www.npmjs.com/package/usethishook)

## Compatibility

|                       | Supported                                        |
| --------------------- | ------------------------------------------------ |
| **Node**              | `>=20` (CI: 20, 22, 24)                          |
| **React / React DOM** | `>=18` (CI: 18 and 19)                           |
| **Module formats**    | ESM + CJS                                        |
| **Types**             | Bundled `.d.ts` / `.d.cts` (no `@types` package) |
| **Bundlers**          | Vite, Next.js, CRA, Module Federation            |

Tests are **Vitest** unit tests with coverage (Codecov). There is no Playwright suite — the published API is covered in Node/jsdom, not browser E2E.

## Why useThisHook

- **No runtime dependencies** — the published package only peers on React
- **Tree-shakeable** — named ESM/CJS exports with generated TypeScript types
- **SSR-safe** — browser hooks fall back on the server and subscribe after hydration
- **Awaitable UI** — confirm, prompt, overlays, and wizards resolve in your click handler

## Quick start

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

Promise-based dialogs — call `confirm()`, then mount `render()` once in the tree:

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

## Hooks

Full API and interactive examples: [usethishook.mentorbridge.in](https://usethishook.mentorbridge.in/).

### State

| Hook                                                                           | Purpose                                             |
| ------------------------------------------------------------------------------ | --------------------------------------------------- |
| [`useBoolean`](https://usethishook.mentorbridge.in/useBoolean)                 | Boolean with required initial value, toggle helpers |
| [`useDisclosure`](https://usethishook.mentorbridge.in/useDisclosure)           | Open / close / toggle for menus and dialogs         |
| [`useDebounce`](https://usethishook.mentorbridge.in/useDebounce)               | Debounce a rapidly changing value                   |
| [`useInterval`](https://usethishook.mentorbridge.in/useInterval)               | Declarative interval (`null` pauses)                |
| [`useCopyToClipboard`](https://usethishook.mentorbridge.in/useCopyToClipboard) | Clipboard write + last copied text                  |
| [`useLocalStorage`](https://usethishook.mentorbridge.in/useLocalStorage)       | JSON state persisted in `localStorage`              |

### Browser

| Hook                                                                         | Purpose                                   |
| ---------------------------------------------------------------------------- | ----------------------------------------- |
| [`useOnlineStatus`](https://usethishook.mentorbridge.in/useOnlineStatus)     | Online / offline status                   |
| [`useMediaQuery`](https://usethishook.mentorbridge.in/useMediaQuery)         | CSS media query subscription              |
| [`useWindowSize`](https://usethishook.mentorbridge.in/useWindowSize)         | Viewport width and height                 |
| [`useOnClickOutside`](https://usethishook.mentorbridge.in/useOnClickOutside) | Click outside a ref                       |
| [`useEventListener`](https://usethishook.mentorbridge.in/useEventListener)   | Stable DOM / window listener              |
| [`useTimeout`](https://usethishook.mentorbridge.in/useTimeout)               | One-shot timer (`null` pauses)            |
| [`useKeyPress`](https://usethishook.mentorbridge.in/useKeyPress)             | Key held down (ignores editable fields)   |
| [`useOverlay`](https://usethishook.mentorbridge.in/useOverlay)               | Promise-based custom overlay              |
| [`useStepFlow`](https://usethishook.mentorbridge.in/useStepFlow)             | Multi-step wizard that resolves when done |
| [`useAsyncSelect`](https://usethishook.mentorbridge.in/useAsyncSelect)       | Native file picker as a Promise           |

### App

| Hook                                                                               | Purpose                                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------ |
| [`useStableCallback`](https://usethishook.mentorbridge.in/useStableCallback)       | Stable function identity, latest body      |
| [`useResetState`](https://usethishook.mentorbridge.in/useResetState)               | State that resets when a key changes       |
| [`useAsyncAction`](https://usethishook.mentorbridge.in/useAsyncAction)             | Pending / error / data for one async call  |
| [`useDebouncedCallback`](https://usethishook.mentorbridge.in/useDebouncedCallback) | Debounce a callback                        |
| [`useFields`](https://usethishook.mentorbridge.in/useFields)                       | Small form object, optional schema         |
| [`useAmountInput`](https://usethishook.mentorbridge.in/useAmountInput)             | Locale-aware amount input                  |
| [`useList`](https://usethishook.mentorbridge.in/useList)                           | Insert / update / remove / reorder by `id` |
| [`useSelection`](https://usethishook.mentorbridge.in/useSelection)                 | Single or multi select by id               |
| [`useSearchState`](https://usethishook.mentorbridge.in/useSearchState)             | URL search params as React state           |
| [`useConfirm`](https://usethishook.mentorbridge.in/useConfirm)                     | Await a yes/no dialog                      |
| [`usePrompt`](https://usethishook.mentorbridge.in/usePrompt)                       | Await a string from a dialog               |
| [`useControllableState`](https://usethishook.mentorbridge.in/useControllableState) | Controlled and uncontrolled in one API     |
| [`useUnsavedChanges`](https://usethishook.mentorbridge.in/useUnsavedChanges)       | Leave / tab-close confirmation             |
| [`useElementSize`](https://usethishook.mentorbridge.in/useElementSize)             | Element size via `ResizeObserver`          |
| [`useInView`](https://usethishook.mentorbridge.in/useInView)                       | Visibility via `IntersectionObserver`      |
| [`usePagination`](https://usethishook.mentorbridge.in/usePagination)               | Page, offset, next / prev with clamping    |

## SSR

Hooks that touch `window`, `document`, `navigator`, or observers are safe to call during SSR. They return safe defaults and attach listeners after hydration. Overlay hooks still need `render()` in the client tree.

## Development

```bash
npm install
npm test
npm run build
npm run playground   # local docs, usually http://localhost:5173
```

| Command                 | Purpose                       |
| ----------------------- | ----------------------------- |
| `npm test`              | Vitest                        |
| `npm run typecheck`     | Library + playground types    |
| `npm run lint`          | ESLint + Prettier             |
| `npm run build`         | ESM + CJS + types             |
| `npm run pack:check`    | publint + Are the Types Wrong |
| `npm run verify:commit` | Full pre-commit gate          |

See [CONTRIBUTING.md](CONTRIBUTING.md), [docs/RELEASE.md](docs/RELEASE.md), [docs/MIGRATION.md](docs/MIGRATION.md), [ROADMAP.md](ROADMAP.md), and [SUPPORT.md](SUPPORT.md).

## License

[MIT](LICENSE) © [Senthil Kumar Thangavel](https://senthilkumar.mentorbridge.in)
