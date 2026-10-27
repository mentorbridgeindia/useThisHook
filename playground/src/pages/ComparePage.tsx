import { hookPageHref, pageHref } from '../hookHref';

const linkClass =
  'font-medium text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300';

const rows = [
  {
    label: 'Runtime dependencies',
    usethishook: 'None (React / react-dom peers only)',
    usehooksTs: 'None for most hooks',
    reactUse: 'Several (including lodash-style helpers in the tree)',
  },
  {
    label: 'Promise dialogs',
    usethishook: 'useConfirm, usePrompt, useOverlay, useStepFlow',
    usehooksTs: 'Not a product surface',
    reactUse: 'Not a product surface',
  },
  {
    label: 'Live playground',
    usethishook: 'Every hook has a demo + API page',
    usehooksTs: 'Docs site, fewer interactive previews',
    reactUse: 'README-oriented',
  },
  {
    label: 'SSR defaults',
    usethishook: 'Browser hooks return safe values until mount',
    usehooksTs: 'Generally SSR-aware',
    reactUse: 'Varies by hook',
  },
  {
    label: 'AI / MCP',
    usethishook: 'usethishook-mcp searches the catalog',
    usehooksTs: 'No first-party MCP server',
    reactUse: 'No first-party MCP server',
  },
];

export const ComparePage = () => (
  <article className="mx-auto max-w-4xl space-y-8">
    <header className="space-y-3">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300/80">
        Compare
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
        useThisHook vs usehooks-ts and react-use
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-muted">
        Those libraries are excellent catalogs of generic hooks. useThisHook is smaller, has zero
        runtime deps, and ships the pieces people usually still rewrite: promise dialogs, a
        playground, and an MCP server for AI tools.
      </p>
    </header>
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="min-w-[40rem] w-full text-left text-sm">
        <thead className="bg-aside text-muted">
          <tr>
            <th className="px-4 py-3 font-medium"> </th>
            <th className="px-4 py-3 font-medium text-fg">useThisHook</th>
            <th className="px-4 py-3 font-medium">usehooks-ts</th>
            <th className="px-4 py-3 font-medium">react-use</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-line">
              <th className="px-4 py-3 font-medium text-fg">{row.label}</th>
              <td className="px-4 py-3 text-muted">{row.usethishook}</td>
              <td className="px-4 py-3 text-muted">{row.usehooksTs}</td>
              <td className="px-4 py-3 text-muted">{row.reactUse}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-sm leading-6 text-muted">
      Start with{' '}
      <a className={linkClass} href={hookPageHref('useConfirm')}>
        useConfirm
      </a>
      ,{' '}
      <a className={linkClass} href={hookPageHref('useStepFlow')}>
        useStepFlow
      </a>
      ,{' '}
      <a className={linkClass} href={hookPageHref('useFingerprint')}>
        useFingerprint
      </a>
      , or{' '}
      <a className={linkClass} href={hookPageHref('useAmountInput')}>
        useAmountInput
      </a>
      . For Cursor, see the{' '}
      <a className={linkClass} href={pageHref('mcp')}>
        MCP setup
      </a>
      .
    </p>
  </article>
);
