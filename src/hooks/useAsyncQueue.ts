import { useCallback, useRef, useState } from 'react';
import { abortError } from './abortError';
import { useStableCallback } from './useStableCallback';

export interface UseAsyncQueueOptions {
  concurrency?: number;
}

interface QueueItem<T> {
  task: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

export const useAsyncQueue = (options: UseAsyncQueueOptions = {}) => {
  const concurrency = Math.max(1, options.concurrency ?? 1);
  const queueRef = useRef<QueueItem<unknown>[]>([]);
  const activeRef = useRef(0);
  const [size, setSize] = useState(0);
  const [pending, setPending] = useState(0);

  const pump = useStableCallback(() => {
    while (activeRef.current < concurrency && queueRef.current.length > 0) {
      const item = queueRef.current.shift();
      if (!item) break;
      activeRef.current += 1;
      setSize(queueRef.current.length);
      setPending(activeRef.current);

      void item.task().then(
        (value) => {
          item.resolve(value);
          activeRef.current -= 1;
          setPending(activeRef.current);
          pump();
        },
        (reason: unknown) => {
          item.reject(reason);
          activeRef.current -= 1;
          setPending(activeRef.current);
          pump();
        },
      );
    }
  });

  const enqueue = useCallback(
    <T>(task: () => Promise<T>) => {
      return new Promise<T>((resolve, reject) => {
        queueRef.current.push({
          task,
          resolve: resolve as (value: unknown) => void,
          reject,
        });
        setSize(queueRef.current.length);
        pump();
      });
    },
    [pump],
  );

  const clear = useCallback(() => {
    const leftover = queueRef.current.splice(0);
    leftover.forEach((item) => item.reject(abortError()));
    setSize(0);
  }, []);

  return { enqueue, size, pending, clear } as const;
};
