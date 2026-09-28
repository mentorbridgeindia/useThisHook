# Migration guides

## 0.2.x → 0.3.0 / 1.0.0

`0.3.0` removed several hooks. **`1.0.0` is the first stable release** and keeps the `0.3.0` / `0.4.0` public API (no further removals in 1.0.0).

### Removed hooks and replacements

| Removed                   | Replacement                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `useToggle`               | [`useBoolean`](https://usethishook.mentorbridge.in/#/useBoolean) — pass a required `true` / `false` initial value |
| `useCounter`              | Local `useState` / your own counter helper                                                                        |
| `usePrevious`             | Track previous value in a ref inside the component                                                                |
| `useDocumentTitle`        | Set `document.title` in an effect, or your app shell                                                              |
| `useHover`                | Pointer handlers or CSS `:hover`                                                                                  |
| `usePreferredColorScheme` | [`useMediaQuery`](https://usethishook.mentorbridge.in/#/useMediaQuery) with `(prefers-color-scheme: dark)`        |
| `useOnChange`             | `useEffect` on the value you care about                                                                           |

### Example: `useToggle` → `useBoolean`

```tsx
// before
const [on, toggle] = useToggle(false);

// after
const { value: on, toggle } = useBoolean(false);
```

### Install

```bash
npm i usethishook@^1.0.0
```

Peers remain **React 18+** and **React DOM 18+** (React 19 supported).
