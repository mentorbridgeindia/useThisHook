# useThisHook

**Stop rewriting the same React hooks in every project.**

Install once. Import only what you need — toggles, debounce, storage, forms, browser APIs, and
dialogs. **40 typed hooks**, zero runtime dependencies, live demos you can paste into production.

```bash
npm i usethishook
```

**[Try the live playground →](https://usethishook.mentorbridge.in/)** · [npm](https://www.npmjs.com/package/usethishook) · [MCP](mcp/README.md) · [Wiki](https://github.com/senthilkumar979/useThisHook/wiki) · [Changelog](CHANGELOG.md)

[![npm](https://img.shields.io/npm/v/usethishook.svg)](https://www.npmjs.com/package/usethishook)
[![downloads](https://img.shields.io/npm/dw/usethishook.svg)](https://www.npmjs.com/package/usethishook)
[![bundle](https://img.shields.io/bundlephobia/minzip/usethishook)](https://bundlephobia.com/package/usethishook)
[![license](https://img.shields.io/npm/l/usethishook.svg)](LICENSE)
[![CI](https://github.com/senthilkumar979/useThisHook/actions/workflows/ci.yml/badge.svg)](https://github.com/senthilkumar979/useThisHook/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/senthilkumar979/useThisHook/graph/badge.svg)](https://codecov.io/gh/senthilkumar979/useThisHook)
[![types](https://img.shields.io/npm/types/usethishook.svg)](https://www.npmjs.com/package/usethishook)

### What’s new in 1.2.0

- **`useSessionStorage`**, **`useThrottle`** / **`useThrottledCallback`**
- **`useScrollLock`**, **`useDocumentVisibility`**, **`useIdle`**
- **`useUpdateEffect`** — `useEffect` that skips the first mount
- **`useAmountInput`** — optional `locales` for custom language separators

See [CHANGELOG.md](CHANGELOG.md) and the [playground](https://usethishook.mentorbridge.in/) for demos and API details. Paste-ready GitHub release notes: [RELEASE_NOTES.md](RELEASE_NOTES.md).

---

## New to React hooks?

A **hook** is a small function whose name starts with `use` (like `useState`).
You call it inside a component to get state or behavior — without writing that plumbing yourself.

With useThisHook you:

1. Install the package
2. Import one hook
3. Use it like any other React hook

No UI kit. No config file. Import only what you need.

---

## 60-second demo: await a confirm dialog

Ask the user before deleting — right in your click handler:

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
            // user said yes — delete here
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

[`useConfirm` live demo](https://usethishook.mentorbridge.in/useConfirm) · also try [`usePrompt`](https://usethishook.mentorbridge.in/usePrompt) · [`useOverlay`](https://usethishook.mentorbridge.in/useOverlay) · [`useStepFlow`](https://usethishook.mentorbridge.in/useStepFlow)

---

## Everyday hooks (same idea)

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

---

## Why teams pick it

| You want…                    | You get…                                               |
| ---------------------------- | ------------------------------------------------------ |
| Less boilerplate             | Toggles, timers, forms, lists, URL state — ready       |
| Dialogs without a UI library | `await confirm()` / `prompt()` / custom overlays       |
| A small install              | **Zero runtime deps** (React is a peer only)           |
| Safe imports                 | Tree-shakeable ESM + CJS with bundled TypeScript types |
| Works with Next / Vite / SSR | Browser hooks use safe defaults until the client runs  |

Works with **React 18+**, **Node 20+**, Vite, Next.js, CRA, and Module Federation.

---

## All hooks

Every hook has a **live preview + API** on the [playground](https://usethishook.mentorbridge.in/).

### State

| Hook                                                                           | What it does                              |
| ------------------------------------------------------------------------------ | ----------------------------------------- |
| [`useBoolean`](https://usethishook.mentorbridge.in/useBoolean)                 | On/off state with toggle helpers          |
| [`useDisclosure`](https://usethishook.mentorbridge.in/useDisclosure)           | Open / close / toggle for menus & dialogs |
| [`useDebounce`](https://usethishook.mentorbridge.in/useDebounce)               | Wait until a value stops changing         |
| [`useThrottle`](https://usethishook.mentorbridge.in/useThrottle)               | Limit how often a value updates           |
| [`useInterval`](https://usethishook.mentorbridge.in/useInterval)               | Run on an interval (`null` pauses)        |
| [`useCopyToClipboard`](https://usethishook.mentorbridge.in/useCopyToClipboard) | Copy text + remember last copy            |
| [`useLocalStorage`](https://usethishook.mentorbridge.in/useLocalStorage)       | State that survives refresh               |
| [`useSessionStorage`](https://usethishook.mentorbridge.in/useSessionStorage)   | State that survives refresh (tab-scoped)  |

### Browser

| Hook                                                                                 | What it does                                |
| ------------------------------------------------------------------------------------ | ------------------------------------------- |
| [`useOnlineStatus`](https://usethishook.mentorbridge.in/useOnlineStatus)             | Online / offline                            |
| [`useFingerprint`](https://usethishook.mentorbridge.in/useFingerprint)               | Client-side visitor id from browser signals |
| [`useMediaQuery`](https://usethishook.mentorbridge.in/useMediaQuery)                 | Match a CSS media query                     |
| [`useWindowSize`](https://usethishook.mentorbridge.in/useWindowSize)                 | Viewport width & height                     |
| [`useOnClickOutside`](https://usethishook.mentorbridge.in/useOnClickOutside)         | Detect clicks outside an element            |
| [`useEventListener`](https://usethishook.mentorbridge.in/useEventListener)           | Stable DOM / window listener                |
| [`useTimeout`](https://usethishook.mentorbridge.in/useTimeout)                       | One-shot timer (`null` pauses)              |
| [`useKeyPress`](https://usethishook.mentorbridge.in/useKeyPress)                     | Key held down (skips text fields)           |
| [`useScrollLock`](https://usethishook.mentorbridge.in/useScrollLock)                 | Lock / unlock document body scroll          |
| [`useDocumentVisibility`](https://usethishook.mentorbridge.in/useDocumentVisibility) | Tab visible or hidden                       |
| [`useIdle`](https://usethishook.mentorbridge.in/useIdle)                             | Idle after no user activity                 |
| [`useOverlay`](https://usethishook.mentorbridge.in/useOverlay)                       | Custom overlay as a Promise                 |
| [`useStepFlow`](https://usethishook.mentorbridge.in/useStepFlow)                     | Multi-step wizard that resolves when done   |
| [`useAsyncSelect`](https://usethishook.mentorbridge.in/useAsyncSelect)               | Native file picker as a Promise             |

### App

| Hook                                                                               | What it does                               |
| ---------------------------------------------------------------------------------- | ------------------------------------------ |
| [`useStableCallback`](https://usethishook.mentorbridge.in/useStableCallback)       | Stable function, always latest body        |
| [`useUpdateEffect`](https://usethishook.mentorbridge.in/useUpdateEffect)           | useEffect that skips the first mount       |
| [`useResetState`](https://usethishook.mentorbridge.in/useResetState)               | Reset state when a key changes             |
| [`useAsyncAction`](https://usethishook.mentorbridge.in/useAsyncAction)             | Pending / error / data for one async call  |
| [`useDebouncedCallback`](https://usethishook.mentorbridge.in/useDebouncedCallback) | Debounce a function                        |
| [`useThrottledCallback`](https://usethishook.mentorbridge.in/useThrottledCallback) | Throttle a function                        |
| [`useFields`](https://usethishook.mentorbridge.in/useFields)                       | Small form object, optional schema         |
| [`useAmountInput`](https://usethishook.mentorbridge.in/useAmountInput)             | Locale-aware money / amount input          |
| [`useList`](https://usethishook.mentorbridge.in/useList)                           | Insert / update / remove / reorder by `id` |
| [`useSelection`](https://usethishook.mentorbridge.in/useSelection)                 | Single or multi select by id               |
| [`useSearchState`](https://usethishook.mentorbridge.in/useSearchState)             | URL search params as React state           |
| [`useConfirm`](https://usethishook.mentorbridge.in/useConfirm)                     | Await a yes/no dialog                      |
| [`usePrompt`](https://usethishook.mentorbridge.in/usePrompt)                       | Await a string from a dialog               |
| [`useControllableState`](https://usethishook.mentorbridge.in/useControllableState) | Controlled + uncontrolled in one API       |
| [`useUnsavedChanges`](https://usethishook.mentorbridge.in/useUnsavedChanges)       | Warn before leaving with dirty data        |
| [`useElementSize`](https://usethishook.mentorbridge.in/useElementSize)             | Element size via `ResizeObserver`          |
| [`useInView`](https://usethishook.mentorbridge.in/useInView)                       | Visibility via `IntersectionObserver`      |
| [`usePagination`](https://usethishook.mentorbridge.in/usePagination)               | Page, offset, next / prev                  |

---

## Contributing

We welcome PRs — new hooks, clearer demos, docs, and bug fixes all help.

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) (and the [Code of Conduct](.github/CODE_OF_CONDUCT.md))
2. Pick an [issue](https://github.com/senthilkumar979/useThisHook/issues) or open a Discussion with an idea
3. Run the local playground while you work: `npm install && npm run playground`

```bash
npm install
npm test
npm run playground   # usually http://localhost:5173
```

Good first wins: tighten a demo, fix a typo, add a test, or document a gotcha you hit as a beginner.

Questions? [Discussions](https://github.com/senthilkumar979/useThisHook/discussions) · Bugs? [Issues](https://github.com/senthilkumar979/useThisHook/issues)

---

## Sponsors

useThisHook is MIT and free forever. If it saves you time, a sponsor helps cover hosting, tooling, and continued hook work.

**[Become a sponsor on GitHub →](https://github.com/sponsors/senthilkumar979)**

Stars, shares, and “used it in production” notes also go a long way — thank you.

---

## More

- [Support](SUPPORT.md) — where to ask questions
- [Security](SECURITY.md) — report vulnerabilities privately
- [Roadmap](ROADMAP.md) — what’s next
- [Migration](docs/MIGRATION.md) · [Release](docs/RELEASE.md)

## License

[MIT](LICENSE) © [Senthil Kumar Thangavel](https://senthilkumar.mentorbridge.in)
