import { useState } from 'react';
import { useRenderTracker } from 'usethishook';
import { buttonClass } from '../components/styles';

const Tracked = ({ nonce }: { nonce: number }) => {
  const renders = useRenderTracker('Tracked', { enabled: true });
  return (
    <p>
      Child renders: <strong>{renders}</strong> (nonce {nonce})
    </p>
  );
};

export const UseRenderTrackerDemo = () => {
  const [nonce, setNonce] = useState(0);
  return (
    <div className="space-y-3">
      <Tracked nonce={nonce} />
      <button type="button" className={buttonClass} onClick={() => setNonce((value) => value + 1)}>
        Re-render child
      </button>
      <p className="text-sm text-muted">Also check the browser console for commit logs.</p>
    </div>
  );
};

export const useRenderTrackerExample = `import { useRenderTracker } from 'usethishook';

export const Panel = (props: { open: boolean }) => {
  useRenderTracker('Panel');
  return props.open ? <div>Open</div> : null;
};`;
