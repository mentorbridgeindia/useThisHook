import { useCallback, useEffect, useRef, useState } from 'react';

function readValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const item = window.sessionStorage.getItem(key);
    return item === null ? fallback : (JSON.parse(item) as T);
  } catch {
    return fallback;
  }
}

export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const [storedValue, setStoredValue] = useState<T>(() => readValue(key, initialValue));

  const setValue = useCallback(
    (value: T | ((previous: T) => T)) => {
      setStoredValue((previous) => {
        const nextValue =
          typeof value === 'function' ? (value as (current: T) => T)(previous) : value;

        try {
          window.sessionStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Ignore write errors (quota, private mode).
        }

        return nextValue;
      });
    },
    [key],
  );

  useEffect(() => {
    setStoredValue(readValue(key, initialValueRef.current));
  }, [key]);

  return [storedValue, setValue] as const;
};
