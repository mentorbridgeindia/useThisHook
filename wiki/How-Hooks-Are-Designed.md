# How Hooks Are Designed

Design rules for public hooks in `src/hooks/`.

## Public API shape

- **Named export** matching the file (`export function useBoolean` / `export const useConfirm`).
- Re-export from [`src/index.ts`](https://github.com/senthilkumar979/useThisHook/blob/main/src/index.ts) so the package surface stays explicit.
- Prefer **interfaces** for options/return object shapes; **union types** (not enums) for closed sets of strings.
- Avoid `any`. Prefer `unknown` and narrow at the boundary.

## Dependencies & size

- **No new runtime dependency** unless the hook cannot work without it. Prefer peer React APIs.
- Keep each hook file **under ~150 lines**. Extract shared UI (e.g. `dialogFrame.tsx`) when overlays share markup.
- Overlay / dialog hooks that need DOM portals use **`react-dom`** and ship as `.tsx`.

## SSR & browser APIs

Browser-facing hooks should:

1. Return a **safe default** when `typeof window === 'undefined'`.
2. Subscribe to listeners / storage / observers **after mount** (effects), so hydration does not fight the server render.

Overlay hooks (`useConfirm`, `usePrompt`, `useOverlay`, `useStepFlow`) are client-oriented: callers mount `render()` in the tree on the client.

## Behavior conventions

- Prefer **declarative** controls: e.g. `useInterval` / `useTimeout` pause with `null` delay rather than imperative start/stop-only APIs.
- Stable function identity where it matters (`useStableCallback`, event hooks) so consumers can pass handlers without effect churn.
- Public helpers must not introduce XSS (no `dangerouslySetInnerHTML` from untrusted strings) or unexpected cross-origin storage leakage.

## Playground parity

Every public hook is documented in the playground with catalog entry, description, API table, and demo. The wiki does not replace that documentation.
