import { useCallback, useEffect, useRef } from 'react';
import { useStableCallback } from './useStableCallback';

export const useThrottledCallback = <TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
) => {
  const stableCallback = useStableCallback(callback);
  const lastInvokedRef = useRef(0);
  const timeoutRef = useRef(0);
  const pendingArgsRef = useRef<TArgs | null>(null);

  const cancel = useCallback(() => {
    window.clearTimeout(timeoutRef.current);
    pendingArgsRef.current = null;
  }, []);

  const run = useCallback(
    (...args: TArgs) => {
      const now = Date.now();
      const remaining = delayMs - (now - lastInvokedRef.current);
      pendingArgsRef.current = args;

      if (remaining <= 0) {
        window.clearTimeout(timeoutRef.current);
        lastInvokedRef.current = now;
        pendingArgsRef.current = null;
        stableCallback(...args);
        return;
      }

      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        lastInvokedRef.current = Date.now();
        const pending = pendingArgsRef.current;
        pendingArgsRef.current = null;
        if (pending) stableCallback(...pending);
      }, remaining);
    },
    [delayMs, stableCallback],
  );

  useEffect(() => cancel, [cancel]);

  return [run, cancel] as const;
};
