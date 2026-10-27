import { useAsyncState } from 'usethishook';
import { buttonClass } from '../components/styles';

export const UseAsyncStateDemo = () => {
  const { status, data, error, execute, reset } = useAsyncState(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    return `Tick ${new Date().toLocaleTimeString()}`;
  });

  return (
    <div className="space-y-3">
      <p>
        Status: <strong>{status}</strong>
      </p>
      <p>{data ?? (error instanceof Error ? error.message : 'Idle')}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => void execute().catch(() => undefined)}
        >
          Execute
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export const useAsyncStateExample = `import { useAsyncState } from 'usethishook';

export const UserCard = ({ userId }: { userId: string }) => {
  const { data, isLoading, execute } = useAsyncState(
    (signal) => fetch(\`/api/users/\${userId}\`, { signal }).then((res) => res.json()),
    { immediate: true, source: userId },
  );
  if (isLoading) return <p>Loading…</p>;
  return <p>{data?.name}</p>;
};`;
