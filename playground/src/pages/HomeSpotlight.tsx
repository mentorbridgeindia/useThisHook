import { hookPageHref } from '../hookHref';

const uniqueHooks = [
  {
    id: 'useConfirm',
    title: 'Promise dialogs',
    body: 'await confirm() and prompt() in the click handler. Overlays and wizards too.',
  },
  {
    id: 'useStepFlow',
    title: 'Typed wizards',
    body: 'Multi-step flows that resolve with every step’s data, or null on cancel.',
  },
  {
    id: 'useFingerprint',
    title: 'Visitor id',
    body: 'Client-side fingerprint from browser signals. No API key, no network.',
  },
  {
    id: 'useAmountInput',
    title: 'Money input',
    body: 'Locale grouping while you type; submit still gets a canonical decimal string.',
  },
];

export const HomeSpotlight = () => (
  <section className="space-y-5">
    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
      What this library is for
    </h2>
    <p className="max-w-2xl text-sm leading-6 text-muted">
      Generic toggles exist everywhere. These four are harder to copy well and are the reason to
      install useThisHook rather than another hook bag.
    </p>
    <ul className="grid gap-3 sm:grid-cols-2">
      {uniqueHooks.map((hook) => (
        <li key={hook.id}>
          <a
            href={hookPageHref(hook.id)}
            className="block rounded-2xl border border-line bg-surface p-5 hover:border-violet-400/50"
          >
            <h3 className="font-mono text-sm font-medium text-fg">{hook.id}</h3>
            <p className="mt-1 text-sm font-medium text-fg">{hook.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{hook.body}</p>
          </a>
        </li>
      ))}
    </ul>
  </section>
);
