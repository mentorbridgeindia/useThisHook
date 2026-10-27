import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { useStableCallback } from './useStableCallback';

export const useOnlineQueue = <T>(processItem: (item: T) => Promise<void>) => {
  const isOnline = useOnlineStatus();
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [isFlushing, setIsFlushing] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const flushingRef = useRef(false);
  const stableProcess = useStableCallback(processItem);

  const enqueue = useCallback((item: T) => {
    setItems((previous) => {
      const next = [...previous, item];
      itemsRef.current = next;
      return next;
    });
  }, []);

  const flush = useCallback(async () => {
    if (flushingRef.current || itemsRef.current.length === 0) return;
    flushingRef.current = true;
    setIsFlushing(true);
    setError(null);

    const drain = async (): Promise<void> => {
      const [next, ...rest] = itemsRef.current;
      if (next === undefined) return;
      await stableProcess(next);
      itemsRef.current = rest;
      setItems(rest);
      await drain();
    };

    try {
      await drain();
    } catch (error_) {
      setError(error_);
    } finally {
      flushingRef.current = false;
      setIsFlushing(false);
    }
  }, [stableProcess]);

  useEffect(() => {
    if (!isOnline || items.length === 0) return;
    void flush();
  }, [flush, isOnline, items.length]);

  return { enqueue, items, isOnline, isFlushing, error, flush } as const;
};
