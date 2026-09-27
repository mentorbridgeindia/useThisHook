import { useState } from 'react';
import { inputClass } from '../components/styles';
import { hookPageHref } from '../hookHref';
import { hooksCatalog } from '../hooksCatalog';

export const HomeHookIndex = () => {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const hooks = hooksCatalog.filter((hook) => {
    if (!normalized) return true;
    return `${hook.name} ${hook.summary} ${hook.category}`.toLowerCase().includes(normalized);
  });

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Browse hooks</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Open a hook for a live preview, API reference, and copy-paste example.
      </p>
      <input
        className={`${inputClass} mt-5`}
        placeholder="Search by name or idea — overlay, storage, debounce…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {hooks.map((hook) => (
          <li key={hook.id}>
            <a
              href={hookPageHref(hook.id)}
              className="block h-full rounded-2xl border border-line bg-surface p-5 transition hover:border-violet-400/40 hover:bg-code"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                {hook.category}
              </p>
              <h3 className="mt-2 font-mono text-base text-fg">{hook.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{hook.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
