# Release notes — usethishook v1.3.0

Paste this body into the GitHub Release for tag **`v1.3.0`**. Full history: [`CHANGELOG.md`](CHANGELOG.md). Publish via **Actions → Publish npm** (see [`docs/RELEASE.md`](docs/RELEASE.md)).

---

## usethishook 1.3.0

Minor release: **13 new hooks**, MCP catalog for all **53** hooks, playground compare page, and try-online sandboxes. **No breaking changes.**

```bash
npm i usethishook@^1.3.0
```

**Playground:** [usethishook.mentorbridge.in](https://usethishook.mentorbridge.in/) · **Compare:** [vs usehooks-ts / react-use](https://usethishook.mentorbridge.in/compare) · **MCP:** [usethishook.mentorbridge.in/mcp](https://usethishook.mentorbridge.in/mcp)

### Async

- **`useAsyncState`** — idle / loading / success / error with abort
- **`useOptimisticAction`** — optimistic update with rollback
- **`useRetry`** — retries, backoff, and cancel
- **`useAsyncQueue`** — FIFO tasks with a concurrency cap
- **`usePolling`** — interval polling that pauses when the tab is hidden

### Browser / PWA

- **`useOnlineQueue`** — in-memory outbox while offline
- **`useStorageQuota`** — `navigator.storage.estimate()`
- **`useInstallPrompt`** — PWA `beforeinstallprompt`
- **`useCrossTabState`** — JSON state synced across tabs
- **`useKeyboardShortcut`** — window key combos
- **`useLongPress`** — mouse and touch press-and-hold

### Debug

- **`useRenderTracker`** — render counts (dev logging)
- **`useWhyDidYouUpdate`** — which values changed (dev logging)

### MCP (`usethishook-mcp@1.3.0`)

Separate package under `mcp/`. Cursor / Claude Desktop:

```json
{
  "mcpServers": {
    "usethishook": {
      "command": "npx",
      "args": ["-y", "usethishook-mcp"]
    }
  }
}
```

---

## Maintainer publish checklist

After this PR is on `main` and CI is green:

1. **Actions → Publish npm → Run workflow** on `main` for `usethishook`
2. Publish `usethishook-mcp` if that workflow is separate (or from `mcp/` with the same OIDC rules)
3. Create the GitHub Release:
   ```bash
   gh release create v1.3.0 --title "v1.3.0" --notes-file RELEASE_NOTES.md
   ```
4. Confirm npm `latest` = `1.3.0` with provenance
5. Spot-check playground `/compare`, `/mcp`, and a few new hook pages
