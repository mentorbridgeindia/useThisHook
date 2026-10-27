const SITE_ORIGIN = 'https://usethishook.mentorbridge.in';
const DEFAULT_DESCRIPTION =
  'Promise-based confirm/prompt dialogs and 53 tree-shakeable React hooks. Zero runtime deps, TypeScript, live playground.';

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

export function applyRouteSeo(options: {
  route: string;
  hookName?: string;
  description?: string;
  title?: string;
}) {
  const { route, hookName, description, title: titleOverride } = options;
  const isHome = !route;
  const title =
    titleOverride ??
    (isHome
      ? 'useThisHook — promise dialogs and zero-dep React hooks'
      : `${hookName ?? route} React hook — useThisHook`);
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
