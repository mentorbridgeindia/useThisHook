import { CodeBlock } from '../components/CodeBlock';
import { hookPageHref, pageHref } from '../hookHref';

const installCommand = `npm i usethishook`;

const usageExample = `import { useConfirm } from 'usethishook';

export const DeleteButton = () => {
  const { confirm, render } = useConfirm();

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          if (await confirm({ title: 'Delete this row?', danger: true })) {
            // user said yes — delete here
          }
        }}
      >
        Delete
      </button>
      {render()}
    </>
  );
};`;

export const HomeInstall = () => (
  <section className="space-y-5">
    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Install</h2>
    <p className="max-w-2xl text-sm leading-6 text-muted">
      Package name:{' '}
      <a
        className="font-medium text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300"
        href="https://www.npmjs.com/package/usethishook"
        rel="noreferrer"
        target="_blank"
      >
        usethishook
      </a>
      . Product name: <span className="text-fg">useThisHook</span>. Needs React 18+ as a peer —
      nothing else. Using Cursor? Add{' '}
      <a
        className="font-medium text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300"
        href={pageHref('mcp')}
      >
        usethishook-mcp
      </a>
      .
    </p>
    <CodeBlock
      label="Terminal"
      code={installCommand}
      copiedToast="I knew it! Welcome to the club"
    />
    <p className="text-sm leading-6 text-muted">
      Then import a named hook. Start with confirm — or open the{' '}
      <a
        className="font-medium text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300"
        href={hookPageHref('useConfirm')}
      >
        live demo
      </a>
      {':'}
    </p>
    <CodeBlock label="React" code={usageExample} />
  </section>
);
