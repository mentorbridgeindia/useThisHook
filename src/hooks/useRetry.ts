import { useCallback, useRef, useState } from 'react';
import { abortError } from './abortError';
import { useStableCallback } from './useStableCallback';

export type RetryBackoff = 'constant' | 'exponential';

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  backoff?: RetryBackoff;
  factor?: number;
  maxDelayMs?: number;
  retryIf?: (error: unknown, attempt: number) => boolean;
}

function delayForAttempt(
  attempt: number,
  delayMs: number,
  backoff: RetryBackoff,
  factor: number,
  maxDelayMs: number,
) {
  const delay = backoff === 'exponential' ? delayMs * factor ** (attempt - 1) : delayMs;
  return Math.min(delay, maxDelayMs);
}

export const useRetry = <TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: RetryOptions = {},
) => {
  const {
    retries = 3,
    delayMs = 250,
    backoff = 'exponential',
    factor = 2,
    maxDelayMs = 30_000,
    retryIf,
  } = options;
  const [isPending, setIsPending] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<unknown>(null);
  const cancelledRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const sleepRejectRef = useRef<((reason: unknown) => void) | null>(null);
  const stableFn = useStableCallback(fn);
  const stableRetryIf = useStableCallback(retryIf ?? (() => true));

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    sleepRejectRef.current?.(abortError());
    sleepRejectRef.current = null;
  }, []);

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve, reject) => {
      sleepRejectRef.current = reject;
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        sleepRejectRef.current = null;
        if (cancelledRef.current) reject(abortError());
        else resolve();
      }, ms);
    });
  }, []);

  const run = useCallback(
    async (...args: TArgs) => {
      cancelledRef.current = false;
      setIsPending(true);
      setError(null);

      try {
        for (let current = 1; current <= retries + 1; current += 1) {
          setAttempt(current);
          try {
            const result = await stableFn(...args);
            if (cancelledRef.current) throw abortError();
            setIsPending(false);
            return result;
          } catch (error_) {
            if (cancelledRef.current || (error_ instanceof Error && error_.name === 'AbortError'))
              throw abortError();
            const canRetry = current <= retries && stableRetryIf(error_, current);
            if (!canRetry) throw error_;
            await sleep(delayForAttempt(current, delayMs, backoff, factor, maxDelayMs));
          }
        }
        throw abortError();
      } catch (error_) {
        setError(error_);
        setIsPending(false);
        throw error_;
      }
    },
    [backoff, delayMs, factor, maxDelayMs, retries, sleep, stableFn, stableRetryIf],
  );

  return { run, cancel, isPending, attempt, error } as const;
};
