import { useEffect, useState } from 'react';

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
] as const;

export const useIdle = (timeoutMs = 60_000): boolean => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId = 0;

    const onActivity = () => {
      setIsIdle(false);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsIdle(true);
      }, timeoutMs);
    };

    onActivity();

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, onActivity, { passive: true });
    }

    return () => {
      window.clearTimeout(timeoutId);
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, onActivity);
      }
    };
  }, [timeoutMs]);

  return isIdle;
};
