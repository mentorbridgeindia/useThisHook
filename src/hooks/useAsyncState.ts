import { useCallback, useEffect, useRef, useState } from 'react';
import { useStableCallback } from './useStableCallback';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseAsyncStateOptions {
  immediate?: boolean;
  source?: unknown;
}

export const useAsyncState = <T>(
  fn: (signal: AbortSignal) => Promise<T>,
  options: UseAsyncStateOptions = {},
) => {
  const { immediate = false, source } = options;
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const stableFn = useStableCallback(fn);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const execute = useCallback(async () => {
    abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus('loading');
    setError(null);

    try {
      const result = await stableFn(controller.signal);
      if (controller.signal.aborted) return undefined;
      setData(result);
      setStatus('success');
      return result;
    } catch (error_) {
      if (controller.signal.aborted) return undefined;
      setError(error_);
      setStatus('error');
      throw error_;
    }
  }, [abort, stableFn]);

  const reset = useCallback(() => {
    abort();
    setStatus('idle');
    setData(undefined);
    setError(null);
  }, [abort]);

  useEffect(() => {
    if (!immediate) return;
    void execute().catch(() => undefined);
    return abort;
  }, [abort, execute, immediate, source]);

  return {
    status,
    data,
    error,
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    execute,
    abort,
    reset,
  } as const;
};
