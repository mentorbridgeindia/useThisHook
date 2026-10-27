import {
  codeSandboxUrl,
  isFeaturedSandboxHook,
  stackBlitzEmbedUrl,
  stackBlitzUrl,
} from '../tryOnline';

const linkClass =
  'font-medium text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300';

interface TryOnlineProps {
  hookId: string;
}

export const TryOnline = ({ hookId }: TryOnlineProps) => {
  const stackBlitz = stackBlitzUrl(hookId);
  const codeSandbox = codeSandboxUrl(hookId);
  const showEmbed = isFeaturedSandboxHook(hookId);

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
        Try without installing
      </h2>
      <p className="text-sm leading-6 text-muted">
        Open the demo in{' '}
        <a className={linkClass} href={stackBlitz} rel="noreferrer" target="_blank">
          StackBlitz
        </a>{' '}
        or{' '}
        <a className={linkClass} href={codeSandbox} rel="noreferrer" target="_blank">
          CodeSandbox
        </a>
        . The playground on this page already runs the same source.
      </p>
      {showEmbed && (
        <iframe
          title={`${hookId} on StackBlitz`}
          src={stackBlitzEmbedUrl(hookId)}
          className="h-[28rem] w-full rounded-2xl border border-line bg-code"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      )}
    </section>
  );
};
