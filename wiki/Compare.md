# vs usehooks-ts and react-use

Public page: [usethishook.mentorbridge.in/compare](https://usethishook.mentorbridge.in/compare).

**useThisHook** is not a clone of those catalogs. The library stays zero-runtime-deps and leans on surfaces they do not ship:

- Promise dialogs (`useConfirm`, `usePrompt`, `useOverlay`, `useStepFlow`)
- A playground with a live demo and API table per hook
- [`usethishook-mcp`](https://usethishook.mentorbridge.in/mcp) so AI clients search the real catalog

Generic hooks (`useDebounce`, `useLocalStorage`, `useMediaQuery`) exist so an app can stay on one import path. Marketing and docs should lead with the unique hooks, not `useBoolean`.
