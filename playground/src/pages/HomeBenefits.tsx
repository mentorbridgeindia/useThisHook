const benefits = [
  {
    title: 'Less boilerplate',
    body: 'Toggles, debounce, timers, forms, lists, and URL state — ready to import so you stop rewriting the same helpers.',
  },
  {
    title: 'Dialogs without a UI kit',
    body: 'Await confirm(), prompt(), overlays, and wizards in your click handler. Mount render() once. No modal library.',
  },
  {
    title: 'Zero runtime dependencies',
    body: 'The published package only peers on React 18+. Works with Vite, Next.js, CRA, and Module Federation.',
  },
  {
    title: 'Docs that match the code',
    body: 'Every page has a live preview, an argument/return reference, and an example you can paste into your app.',
  },
  {
    title: 'Built for AI tools',
    body: 'usethishook-mcp lets Cursor and Claude search the real catalog instead of inventing hook APIs.',
  },
];

export const HomeBenefits = () => (
  <section>
    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
      Why useThisHook
    </h2>
    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
      {benefits.map((benefit) => (
        <li key={benefit.title} className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-base font-medium text-fg">{benefit.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{benefit.body}</p>
        </li>
      ))}
    </ul>
  </section>
);
