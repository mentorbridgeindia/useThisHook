import { GooeyToaster } from 'goey-toast';
import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { getHookById } from './hooksCatalog';
import { redirectLegacyHash, routeFromPathname } from './hookHref';
import { HomePage } from './pages/HomePage';
import { HookPage } from './pages/HookPage';
import { applyRouteSeo } from './seo';

function readRoute() {
  return routeFromPathname(window.location.pathname);
}

export const App = () => {
  const [route, setRoute] = useState(() => {
    redirectLegacyHash();
    return readRoute();
  });

  useEffect(() => {
    const handlePopState = () => setRoute(readRoute());
    window.addEventListener('popstate', handlePopState);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = (event.target as Element | null)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
      if (target.target && target.target !== '_self') return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }
      window.history.pushState(null, '', `${url.pathname}${url.search}`);
      setRoute(routeFromPathname(url.pathname));
    };

    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  const hook = route ? getHookById(route) : undefined;

  useEffect(() => {
    applyRouteSeo({
      route,
      hookName: hook?.name,
      description: hook
        ? `${hook.description} Live demo and API for ${hook.name} from usethishook.`
        : undefined,
    });
  }, [route, hook]);

  return (
    <>
      <Layout activeId={hook?.id}>{hook ? <HookPage hook={hook} /> : <HomePage />}</Layout>
      <GooeyToaster position="bottom-right" />
    </>
  );
};
