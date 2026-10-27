import { pageHref } from '../hookHref';
import { version } from '../../../package.json';

const linkClass =
  'text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300';

export const SiteFooter = () => (
  <footer className="mt-16 border-t border-line pt-6 text-sm text-muted">
    <p>
      useThisHook v{version} · MIT ·{' '}
      <a
        className={linkClass}
        href="https://www.npmjs.com/package/usethishook"
        rel="noreferrer"
        target="_blank"
      >
        npm
      </a>{' '}
      ·{' '}
      <a
        className={linkClass}
        href="https://github.com/senthilkumar979/useThisHook"
        rel="noreferrer"
        target="_blank"
      >
        GitHub
      </a>{' '}
      ·{' '}
      <a
        className={linkClass}
        href="https://github.com/senthilkumar979/useThisHook/wiki"
        rel="noreferrer"
        target="_blank"
      >
        Wiki
      </a>{' '}
      ·{' '}
      <a className={linkClass} href={pageHref('compare')}>
        Compare
      </a>{' '}
      ·{' '}
      <a className={linkClass} href={pageHref('mcp')}>
        MCP
      </a>{' '}
      ·{' '}
      <a
        className={linkClass}
        href="https://github.com/senthilkumar979/useThisHook/blob/main/CONTRIBUTING.md"
        rel="noreferrer"
        target="_blank"
      >
        Contribute
      </a>{' '}
      ·{' '}
      <a
        className={linkClass}
        href="https://github.com/sponsors/senthilkumar979"
        rel="noreferrer"
        target="_blank"
      >
        Sponsor
      </a>
    </p>
  </footer>
);
