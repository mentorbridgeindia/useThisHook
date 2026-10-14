# Release notes — usethishook v1.2.0

Paste this body into the GitHub Release for tag **`v1.2.0`**. Full history: [`CHANGELOG.md`](CHANGELOG.md). Publish via **Actions → Publish npm** (see [`docs/RELEASE.md`](docs/RELEASE.md)).

---

## usethishook 1.2.0

Minor release: **seven new hooks**, optional custom locales for `useAmountInput`, and playground **New** badges. **No breaking changes.** The library now ships **40** typed hooks.

```bash
npm i usethishook@^1.2.0
```

**Playground:** [usethishook.mentorbridge.in](https://usethishook.mentorbridge.in/)

### State

- **`useSessionStorage`** — JSON state in `sessionStorage` (same shape as `useLocalStorage`)
- **`useThrottle`** — throttle a value (leading + trailing)

### Browser

- **`useScrollLock`** — lock / unlock `document.body` scroll for overlays
- **`useDocumentVisibility`** — Page Visibility API (`visible` | `hidden`)
- **`useIdle`** — true after a period of no user activity

### App

- **`useThrottledCallback`** — throttle a function, with cancel
- **`useUpdateEffect`** — like `useEffect`, but skips the initial mount

### Forms

- **`useAmountInput`** — optional `locales` map to register or override separators beyond built-in `en` / `de` / `nl` / `fr`
- Exported **`AmountLocaleConfig`** type

### Not in this npm package

- **`usethishook-mcp`** remains under Unreleased (separate package under `mcp/`). See [mcp/README.md](mcp/README.md).

---

## Maintainer publish checklist

After this docs PR is on `main` and CI is green:

1. **Actions → Publish npm → Run workflow** on `main` (OIDC Trusted Publishing + provenance)
2. Create the GitHub Release:
   ```bash
   gh release create v1.2.0 --title "v1.2.0" --notes-file RELEASE_NOTES.md
   ```
   Or paste the section above into the GitHub UI (omit this checklist footer from the public body if you prefer).
3. Confirm [npmjs.com/package/usethishook](https://www.npmjs.com/package/usethishook) shows `latest` = `1.2.0` with provenance
4. Spot-check the playground deploy for new hooks and **New** badges
