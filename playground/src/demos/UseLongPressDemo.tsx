import { useState } from 'react';
import { useLongPress } from 'usethishook';
import { buttonClass } from '../components/styles';

export const UseLongPressDemo = () => {
  const [message, setMessage] = useState('Hold the button');
  const bind = useLongPress(() => setMessage('Long press'), { delayMs: 500 });

  return (
    <div className="space-y-3">
      <p>{message}</p>
      <button type="button" className={buttonClass} {...bind}>
        Press and hold
      </button>
    </div>
  );
};

export const useLongPressExample = `import { useLongPress } from 'usethishook';

export const Card = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const bind = useLongPress(onOpenMenu);
  return <div {...bind}>Hold for menu</div>;
};`;
