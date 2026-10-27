import { useCallback, useRef, useState } from 'react';
import { useStableCallback } from './useStableCallback';

export const useOptimisticAction = <TState, TArgs extends unknown[]>(
  initialValue: TState,
  action: (value: TState, ...args: TArgs) => Promise<TState>,
  optimistic: (value: TState, ...args: TArgs) => TState,
) => {
  const [value, setValue] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const pendingRef = useRef(false);
  const generationRef = useRef(0);
  const stableAction = useStableCallback(action);
  const stableOptimistic = useStableCallback(optimistic);

  const run = useCallback(
    async (...args: TArgs) => {
      if (pendingRef.current) return valueRef.current;

      const previous = valueRef.current;
      const next = stableOptimistic(previous, ...args);
      const generation = ++generationRef.current;
      pendingRef.current = true;
      valueRef.current = next;
      setValue(next);
      setIsPending(true);
      setError(null);

      try {
        const confirmed = await stableAction(next, ...args);
        if (generation !== generationRef.current) return confirmed;
        pendingRef.current = false;
        valueRef.current = confirmed;
        setValue(confirmed);
        setIsPending(false);
        return confirmed;
      } catch (error_) {
        if (generation !== generationRef.current) throw error_;
        pendingRef.current = false;
        valueRef.current = previous;
        setValue(previous);
        setError(error_);
        setIsPending(false);
        throw error_;
      }
    },
    [stableAction, stableOptimistic],
  );

  const reset = useCallback(() => {
    generationRef.current += 1;
    pendingRef.current = false;
    valueRef.current = initialValue;
    setValue(initialValue);
    setIsPending(false);
    setError(null);
  }, [initialValue]);

  return { value, run, isPending, error, reset } as const;
};
