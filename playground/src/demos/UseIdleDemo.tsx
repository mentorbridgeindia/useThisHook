import { useIdle } from 'usethishook';
import { ghostButtonClass } from '../components/styles';

export const UseIdleDemo = () => {
  const isIdle = useIdle(3000);

  return (
    <div className="space-y-3">
      <p>
        Status: <strong>{isIdle ? 'idle' : 'active'}</strong> (3s timeout for this demo)
      </p>
      <p className="text-sm text-muted">
        Move the mouse, type, or scroll to reset. After 3 seconds of quiet, the hook reports idle.
      </p>
      <button type="button" className={ghostButtonClass}>
        Focus / click here
      </button>
    </div>
  );
};

export const useIdleExample = `import { useIdle } from 'usethishook';

export const SessionGuard = () => {
  const isIdle = useIdle(5 * 60_000);
  if (!isIdle) return null;
  return <p>You have been idle. Session may expire soon.</p>;
};`;
