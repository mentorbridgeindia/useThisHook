import { useState } from 'react';
import { useRetry } from 'usethishook';
import { buttonClass } from '../components/styles';

export const UseRetryDemo = () => {
  const [flaky, setFlaky] = useState(true);
  const { run, cancel, isPending, attempt, error } = useRetry(
    async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 200));
      if (flaky) throw new Error('Network blip');
      return 'Saved';
    },
    { retries: 4, delayMs: 300, backoff: 'exponential' },
  );

  return (
    <div className="space-y-3">
      <p>
        Attempt {attempt} {isPending ? '…' : ''} {error instanceof Error ? error.message : ''}
      </p>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={flaky}
          onChange={(event) => setFlaky(event.target.checked)}
        />
        <span>Fail on purpose</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => void run().catch(() => undefined)}
        >
          Save with retry
        </button>
        <button type="button" className={buttonClass} onClick={cancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export const useRetryExample = `import { useRetry } from 'usethishook';

export const SaveDraft = () => {
  const { run, isPending } = useRetry(api.save, { retries: 3, backoff: 'exponential' });
  return (
    <button type="button" disabled={isPending} onClick={() => void run()}>
      Save
    </button>
  );
};`;
