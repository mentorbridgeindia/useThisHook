import { BrandMark } from '../components/BrandMark';
import { trustBadges } from '../trustBadges';
import { HomeBenefits } from './HomeBenefits';
import { HomeHookIndex } from './HomeHookIndex';
import { HomeInstall } from './HomeInstall';

export const HomePage = () => (
  <div className="mx-auto max-w-4xl space-y-16">
    <header className="space-y-5">
      <BrandMark />
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300/80">
        Open source React hooks
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-fg md:text-5xl">
        useThisHook is a typed library of custom React hooks you can drop into any app.
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-muted">
        Stop rewriting toggle, debounce, overlay, wizard, and file-picker logic. Import a named
        hook, wire it to your UI, and ship. This playground is the documentation: try the hook, read
        what it takes and returns, then copy the example.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="#install"
          className="rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20"
        >
          Install
        </a>
        <a
          href="#hooks"
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-fg hover:bg-code"
        >
          Browse hooks
        </a>
      </div>
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
    <HomeBenefits />
    <div id="install" className="scroll-mt-8">
      <HomeInstall />
    </div>
    <div id="hooks" className="scroll-mt-8">
      <HomeHookIndex />
    </div>
  </div>
);
