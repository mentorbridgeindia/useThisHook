const HOOK_ID = /^use[A-Za-z0-9]+$/;

/** Vite base path, always ending with `/` (e.g. `/` or `/useThisHook/`). */
export function playgroundBase(): string {
  const base = import.meta.env.BASE_URL;
  return base.endsWith('/') ? base : `${base}/`;
}

export function homeHref(): string {
  return playgroundBase();
}

export function hookPageHref(id: string) {
  if (!HOOK_ID.test(id)) return homeHref();
  return `${playgroundBase()}${id}`;
}

/** Strip Vite base from pathname; returns hook id or `''` for home. */
export function routeFromPathname(pathname: string): string {
  const base = playgroundBase();
  let path = pathname;
  if (base !== '/' && path.startsWith(base.slice(0, -1))) {
    path = path.slice(base.length - 1);
  }
  const trimmed = path.replace(/^\//, '').replace(/\/$/, '');
  if (!trimmed) return '';
  const segment = trimmed.split('/')[0] ?? '';
  return HOOK_ID.test(segment) ? segment : '';
}

/** Redirect legacy `#/useX` hash URLs to path-based routes once. */
export function redirectLegacyHash(): void {
  const hash = window.location.hash;
  if (!hash.startsWith('#/')) return;
  const id = hash.slice(2).replace(/\/$/, '');
  const target = !id || id === '' ? homeHref() : HOOK_ID.test(id) ? hookPageHref(id) : homeHref();
  const url = new URL(target, window.location.origin);
  window.history.replaceState(null, '', `${url.pathname}${url.search}`);
}
