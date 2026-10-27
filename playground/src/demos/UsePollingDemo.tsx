import { useState } from 'react';
import { usePolling } from 'usethishook';
import { buttonClass } from '../components/styles';

export const UsePollingDemo = () => {
  const [ticks, setTicks] = useState(0);
  const [delay, setDelay] = useState<number | null>(1000);
  const { isPolling } = usePolling(() => {
    setTicks((value) => value + 1);
  }, delay);

  return (
    <div className="space-y-3">
      <p>
        Ticks: <strong>{ticks}</strong> {isPolling ? '(polling)' : '(paused)'}
      </p>
      <p className="text-sm text-muted">Hide this tab to pause. Restore it to resume.</p>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setDelay((current) => (current == null ? 1000 : null))}
      >
        {delay == null ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
};

export const usePollingExample = `import { useState } from 'react';
import { usePolling } from 'usethishook';

export const InboxBadge = () => {
  const [count, setCount] = useState(0);
  usePolling(async (signal) => {
    const data = await api.unread({ signal });
    setCount(data);
  }, 10_000);
  return <span>{count}</span>;
};`;
