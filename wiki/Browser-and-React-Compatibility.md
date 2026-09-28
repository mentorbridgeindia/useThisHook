# Browser & React Compatibility

## React

| Requirement  | Detail                                                                  |
| ------------ | ----------------------------------------------------------------------- |
| **Peers**    | `react` and `react-dom` `>=18`                                          |
| **React 19** | Supported (CI matrix includes 18 and 19)                                |
| **Overlays** | `useConfirm`, `usePrompt`, `useOverlay`, `useStepFlow` need `react-dom` |

## Node / tooling

- Published package targets modern bundlers (Vite, Next.js, CRA, Module Federation).
- Develop and CI with **Node `>=20`** (CI: 20, 22, 24).

## SSR

Browser hooks return safe defaults on the server and subscribe after hydration. They are intended for React DOM apps with optional SSR (e.g. Next.js client components or isomorphic apps that call hooks only where `window` eventually exists).

Awaitable UI hooks that call `render()` must run on the client.

## Browsers

Hooks that use modern platform APIs assume a **current evergreen browser**:

- `ResizeObserver` — `useElementSize`
- `IntersectionObserver` — `useInView`
- Clipboard API — `useCopyToClipboard`
- `matchMedia` — `useMediaQuery`
- `localStorage` — `useLocalStorage`

There is no published matrix of minimum Chrome / Firefox / Safari versions. Polyfills are out of scope for the library; apps that support older browsers should polyfill or avoid those hooks.

## Module formats

ESM + CJS with bundled TypeScript types (`.d.ts` / `.d.cts`). No separate `@types` package.
