import { ApiReference } from '../components/ApiReference';
import { CodeBlock } from '../components/CodeBlock';
import { HookTagBadge } from '../components/HookTagBadge';
import { PreviewCard } from '../components/PreviewCard';
import { TryOnline } from '../components/TryOnline';
import type { HookDoc } from '../hooksCatalog';

interface HookPageProps {
  hook: HookDoc;
}

export const HookPage = ({ hook }: HookPageProps) => {
  const Demo = hook.Demo;

  return (
    <article className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300/80">
            {hook.category} hook
          </p>
          <HookTagBadge tags={hook.tags} />
        </div>
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          {hook.name}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-muted">{hook.summary}</p>
        <p className="max-w-2xl text-sm leading-6 text-muted">{hook.whenToUse}</p>
      </header>
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Description
        </h2>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="max-w-3xl text-[0.95rem] leading-7 text-muted">{hook.description}</p>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Live preview
        </h2>
        <PreviewCard>
          <Demo />
        </PreviewCard>
      </section>
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          API reference
        </h2>
        <ApiReference name={hook.name} api={hook.api} />
      </section>
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
          Drop into a component
        </h2>
        <CodeBlock code={hook.example} />
      </section>
      <TryOnline hookId={hook.id} />
    </article>
  );
};
