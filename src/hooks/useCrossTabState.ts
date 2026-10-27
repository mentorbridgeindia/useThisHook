import { useCallback, useEffect, useId, useRef, useState } from 'react';

function readValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const item = window.localStorage.getItem(key);
    return item === null ? fallback : (JSON.parse(item) as T);
  } catch {
    return fallback;
  }
}

function writeValue<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode.
  }
}

interface ChannelMessage<T> {
  key: string;
  value: T;
  source: string;
}

export const useCrossTabState = <T>(key: string, initialValue: T) => {
  const sourceId = useId();
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;
  const [value, setValue] = useState<T>(() => readValue(key, initialValue));
  const channelRef = useRef<BroadcastChannel | null>(null);

  const publish = useCallback(
    (next: T) => {
      writeValue(key, next);
      channelRef.current?.postMessage({
        key,
        value: next,
        source: sourceId,
      } satisfies ChannelMessage<T>);
    },
    [key, sourceId],
  );

  const setCrossTabValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? (next as (current: T) => T)(previous) : next;
        publish(resolved);
        return resolved;
      });
    },
    [publish],
  );

  useEffect(() => {
    setValue(readValue(key, initialValueRef.current));

    const channel =
      typeof BroadcastChannel === 'function' ? new BroadcastChannel(`usethishook:${key}`) : null;
    channelRef.current = channel;

    const handleMessage = (event: MessageEvent<ChannelMessage<T>>) => {
      if (event.data?.key !== key || event.data.source === sourceId) return;
      setValue(event.data.value);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) return;
      if (event.newValue == null) {
        setValue(initialValueRef.current);
        return;
      }
      try {
        setValue(JSON.parse(event.newValue) as T);
      } catch {
        setValue(initialValueRef.current);
      }
    };

    channel?.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);

    return () => {
      channel?.removeEventListener('message', handleMessage);
      channel?.close();
      channelRef.current = null;
      window.removeEventListener('storage', handleStorage);
    };
  }, [key, sourceId]);

  return [value, setCrossTabValue] as const;
};
