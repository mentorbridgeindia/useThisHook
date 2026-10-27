import { useOnlineQueue } from 'usethishook';
import { buttonClass } from '../components/styles';

export const UseOnlineQueueDemo = () => {
  const { enqueue, items, isOnline, isFlushing } = useOnlineQueue(async (item: string) => {
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    console.debug('flushed', item);
  });

  return (
    <div className="space-y-3">
      <p>
        {isOnline ? 'Online' : 'Offline'} {isFlushing ? '· flushing' : ''}
      </p>
      <button
        type="button"
        className={buttonClass}
        onClick={() => enqueue(`note ${items.length + 1}`)}
      >
        Queue a note
      </button>
      <p className="text-sm text-muted">
        Toggle the browser offline checkbox in DevTools to hold the queue.
      </p>
      <ul className="text-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export const useOnlineQueueExample = `import { useOnlineQueue } from 'usethishook';

export const Outbox = () => {
  const { enqueue, items } = useOnlineQueue(api.send);
  return (
    <button type="button" onClick={() => enqueue({ text: 'hello' })}>
      Queue ({items.length})
    </button>
  );
};`;
