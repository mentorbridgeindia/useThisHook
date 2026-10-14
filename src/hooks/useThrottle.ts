import { useEffect, useRef, useState } from 'react';

/**
 * Throttles a value: updates at most once per `delayMs`, with a trailing
 * update so the latest value is not lost.
 */
export const useThrottle = <T>(value: T, delayMs = 300): T => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdatedRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdatedRef.current;
    const remaining = delayMs - elapsed;

    if (remaining <= 0) {
      lastUpdatedRef.current = now;
      setThrottledValue(value);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      lastUpdatedRef.current = Date.now();
      setThrottledValue(value);
    }, remaining);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayMs]);

  return throttledValue;
};
