import { useEffect, useState } from 'react';
import { useDocumentVisibility } from './useDocumentVisibility';
import { useStableCallback } from './useStableCallback';

export interface UsePollingOptions {
  pauseWhenHidden?: boolean;
  immediate?: boolean;
}

export const usePolling = (
  fn: (signal: AbortSignal) => void | Promise<void>,
  intervalMs: number | null,
  options: UsePollingOptions = {},
) => {
  const { pauseWhenHidden = true, immediate = true } = options;
  const visibility = useDocumentVisibility();
  const [error, setError] = useState<unknown>(null);
  const [isPolling, setIsPolling] = useState(false);
  const stableFn = useStableCallback(fn);
  const isPaused = intervalMs === null || (pauseWhenHidden && visibility === 'hidden');

  useEffect(() => {
    if (isPaused || intervalMs === null) {
      setIsPolling(false);
      return;
    }

    let alive = true;
    let inFlight: AbortController | null = null;
    setIsPolling(true);

    const tick = async () => {
      inFlight?.abort();
      const controller = new AbortController();
      inFlight = controller;
      try {
        await stableFn(controller.signal);
        if (alive && !controller.signal.aborted) setError(null);
      } catch (error_) {
        if (alive && !controller.signal.aborted) setError(error_);
      }
    };

    if (immediate) void tick();
    const id = window.setInterval(() => void tick(), intervalMs);

    return () => {
      alive = false;
      inFlight?.abort();
      window.clearInterval(id);
      setIsPolling(false);
    };
  }, [immediate, intervalMs, isPaused, stableFn]);

  return { isPolling, error } as const;
};
