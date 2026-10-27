import { useState } from 'react';
import { useWhyDidYouUpdate } from 'usethishook';
import { buttonClass } from '../components/styles';

const Row = ({ label, count }: { label: string; count: number }) => {
  useWhyDidYouUpdate('Row', { label, count }, { enabled: true });
  return (
    <p>
      {label}: {count}
    </p>
  );
};

export const UseWhyDidYouUpdateDemo = () => {
  const [count, setCount] = useState(0);
  const [label] = useState('Clicks');
  return (
    <div className="space-y-3">
      <Row label={label} count={count} />
      <button type="button" className={buttonClass} onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <p className="text-sm text-muted">Open the console. Only \`count\` should show as changed.</p>
    </div>
  );
};

export const useWhyDidYouUpdateExample = `import { useWhyDidYouUpdate } from 'usethishook';

export const Row = (props: { id: string; selected: boolean }) => {
  useWhyDidYouUpdate('Row', props);
  return <div>{props.id}</div>;
};`;
