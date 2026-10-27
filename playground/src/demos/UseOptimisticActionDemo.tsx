import { useOptimisticAction } from 'usethishook';
import { buttonClass } from '../components/styles';

export const UseOptimisticActionDemo = () => {
  const { value, run, isPending, error } = useOptimisticAction(
    0,
    async (next) => {
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      if (next > 3) throw new Error('Server rejected likes over 3');
      return next;
    },
    (current) => current + 1,
  );

  return (
    <div className="space-y-3">
      <p>
        Likes: <strong>{value}</strong> {isPending ? '(saving…)' : ''}
      </p>
      {error instanceof Error && (
        <p className="text-sm text-muted">{error.message} — rolled back.</p>
      )}
      <button
        type="button"
        className={buttonClass}
        onClick={() => void run().catch(() => undefined)}
      >
        Like
      </button>
    </div>
  );
};

export const useOptimisticActionExample = `import { useOptimisticAction } from 'usethishook';

export const LikeButton = ({ initial }: { initial: number }) => {
  const { value, run, isPending } = useOptimisticAction(
    initial,
    (next) => api.setLikes(next),
    (current) => current + 1,
  );
  return (
    <button type="button" disabled={isPending} onClick={() => void run()}>
      {value}
    </button>
  );
};`;
