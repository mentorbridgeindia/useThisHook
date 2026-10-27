import { useState } from 'react';
import { useAsyncQueue } from 'usethishook';
import { buttonClass } from '../components/styles';

export const UseAsyncQueueDemo = () => {
  const { enqueue, size, pending, clear } = useAsyncQueue({ concurrency: 1 });
  const [log, setLog] = useState<string[]>([]);

  const add = () => {
    const id = log.length + size + pending + 1;
    void enqueue(async () => {
      setLog((previous) => [...previous, `start ${id}`]);
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setLog((previous) => [...previous, `done ${id}`]);
    });
  };

  return (
    <div className="space-y-3">
      <p>
        Waiting {size} · running {pending}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={add}>
          Enqueue upload
        </button>
        <button type="button" className={buttonClass} onClick={clear}>
          Clear waiting
        </button>
      </div>
      <ul className="text-sm text-muted">
        {log.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
};

export const useAsyncQueueExample = `import { useAsyncQueue } from 'usethishook';

export const Uploader = () => {
  const { enqueue, pending } = useAsyncQueue({ concurrency: 2 });
  return (
    <button type="button" onClick={() => void enqueue(() => api.upload(file))}>
      Upload ({pending} running)
    </button>
  );
};`;
