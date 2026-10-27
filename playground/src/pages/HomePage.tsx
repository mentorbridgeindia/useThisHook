import { BrandMark } from '../components/BrandMark';
import { hookPageHref, pageHref } from '../hookHref';
import { trustBadges } from '../trustBadges';
import { HomeBenefits } from './HomeBenefits';
import { HomeCommunity } from './HomeCommunity';
import { HomeHookIndex } from './HomeHookIndex';
import { HomeInstall } from './HomeInstall';
import { HomeSpotlight } from './HomeSpotlight';

export const HomePage = () => (
  <div className="mx-auto max-w-4xl space-y-16">
    <header className="space-y-5">
      <BrandMark />
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300/80">
        53 typed hooks · Zero runtime deps
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-fg md:text-5xl">
        Promise dialogs and 53 hooks. Zero runtime deps.
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-muted">
        Await confirm() in a click handler. Import debounce, storage, and browser APIs without a UI
        kit. TypeScript, SSR-safe, live playground. Built for React 18+.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="#install"
          className="rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20"
        >
          Install
        </a>
        <a
          href={hookPageHref('useConfirm')}
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-fg hover:bg-code"
        >
          Try useConfirm
        </a>
        <a
          href={pageHref('compare')}
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-fg hover:bg-code"
        >
          vs usehooks-ts
        </a>
        <a
          href={pageHref('mcp')}
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-fg hover:bg-code"
        >
          MCP for Cursor
        </a>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-muted">
        New to hooks? A hook is a function that starts with <span className="text-fg">use</span>{' '}
        (like <span className="font-mono text-fg">useState</span>). Install the package, import one
        hook, and use it like any other React hook — no UI kit required.
      </p>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {trustBadges.map((badge) => (
            <a
              key={badge.label}
              href={badge.href}
              rel="noreferrer"
              target="_blank"
              className="inline-flex opacity-90 transition hover:opacity-100"
            >
              <img src={badge.imageSrc} alt={badge.label} height={20} className="h-5" />
            </a>
          ))}
        </div>
        <p className="text-xs text-muted">CI + SonarCloud + Snyk on every push.</p>
      </div>
    </header>
    <HomeSpotlight />
    <HomeBenefits />
    <div id="install" className="scroll-mt-8">
      <HomeInstall />
    </div>
    <div id="hooks" className="scroll-mt-8">
      <HomeHookIndex />
    </div>
    <div id="community" className="scroll-mt-8">
      <HomeCommunity />
    </div>
  </div>
);
