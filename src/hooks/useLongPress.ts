import { useCallback, useRef, type MouseEvent, type TouchEvent } from 'react';
import { useStableCallback } from './useStableCallback';

export interface UseLongPressOptions {
  delayMs?: number;
  moveThresholdPx?: number;
}

type PressEvent = MouseEvent | TouchEvent;

export const useLongPress = (
  onLongPress: (event: PressEvent) => void,
  options: UseLongPressOptions = {},
) => {
  const { delayMs = 500, moveThresholdPx = 10 } = options;
  const stableLongPress = useStableCallback(onLongPress);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const didFireRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current == null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const start = useCallback(
    (event: PressEvent, x: number, y: number) => {
      clear();
      didFireRef.current = false;
      startRef.current = { x, y };
      timerRef.current = window.setTimeout(() => {
        didFireRef.current = true;
        stableLongPress(event);
        timerRef.current = null;
      }, delayMs);
    },
    [clear, delayMs, stableLongPress],
  );

  const move = useCallback(
    (x: number, y: number) => {
      const origin = startRef.current;
      if (!origin) return;
      const distance = Math.hypot(x - origin.x, y - origin.y);
      if (distance >= moveThresholdPx) clear();
    },
    [clear, moveThresholdPx],
  );

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      start(event, event.clientX, event.clientY);
    },
    [start],
  );

  const onTouchStart = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      start(event, touch.clientX, touch.clientY);
    },
    [start],
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => move(event.clientX, event.clientY),
    [move],
  );

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      move(touch.clientX, touch.clientY);
    },
    [move],
  );

  const onContextMenu = useCallback((event: MouseEvent) => {
    if (!didFireRef.current) return;
    event.preventDefault();
  }, []);

  return {
    onMouseDown,
    onMouseUp: clear,
    onMouseLeave: clear,
    onMouseMove,
    onTouchStart,
    onTouchEnd: clear,
    onTouchMove,
    onContextMenu,
  } as const;
};
