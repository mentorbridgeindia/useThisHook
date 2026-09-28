const SITE_ORIGIN = 'https://usethishook.mentorbridge.in';
const DEFAULT_DESCRIPTION =
  'Typed React hooks for everyday UI, forms, overlays, and browser APIs. Zero runtime dependencies.';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function applyRouteSeo(options: { route: string; hookName?: string; description?: string }) {
  const { route, hookName, description } = options;
  const isHome = !route;
  const title = isHome ? 'useThisHook — typed React hooks' : `${hookName ?? route} — useThisHook`;
  const desc = description?.trim() || DEFAULT_DESCRIPTION;
  const path = isHome ? '/' : `/${route}`;
  const canonical = `${SITE_ORIGIN}${path}`;

  document.title = title;
  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:url', canonical);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', desc);
  setCanonical(canonical);
}
