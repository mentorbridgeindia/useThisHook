import { useState } from 'react';
import { useUpdateEffect } from 'usethishook';
import { ghostButtonClass } from '../components/styles';

export const UseUpdateEffectDemo = () => {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useUpdateEffect(() => {
    setLogs((previous) => [`Update effect ran for count=${count}`, ...previous].slice(0, 5));
  }, [count]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Count starts at 0. The update effect does not run on first paint — only when count changes.
      </p>
      <p>
        Count: <strong>{count}</strong>
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={ghostButtonClass} onClick={() => setCount((n) => n + 1)}>
          Increment
        </button>
        <button type="button" className={ghostButtonClass} onClick={() => setCount(0)}>
          Reset to 0
        </button>
      </div>
      <ul className="space-y-1 text-sm text-muted">
        {logs.length === 0 ? <li>No update effects yet.</li> : null}
        {logs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export const useUpdateEffectExample = `import { useState } from 'react';
import { useUpdateEffect } from 'usethishook';

export const Tracker = ({ userId }: { userId: string }) => {
  useUpdateEffect(() => {
    analytics.track('user-changed', { userId });
  }, [userId]);

  return <p>{userId}</p>;
};`;
