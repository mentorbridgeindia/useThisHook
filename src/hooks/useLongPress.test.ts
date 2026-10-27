import { act, renderHook } from '@testing-library/react';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLongPress } from './useLongPress';

function mouseEvent(init: MouseEventInit) {
  return new MouseEvent('mousedown', init) as unknown as ReactMouseEvent;
}

function touchEvent(clientX: number, clientY: number, extra: { empty?: boolean } = {}) {
  return {
    touches: extra.empty ? [] : [{ clientX, clientY }],
  } as unknown as ReactTouchEvent;
}

describe('useLongPress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires after the delay on mouse down', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress(onLongPress, { delayMs: 400 }));
    const event = mouseEvent({ clientX: 0, clientY: 0, button: 0 });

    act(() => {
      result.current.onMouseDown(event);
      vi.advanceTimersByTime(399);
    });
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('cancels when the pointer moves too far', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(onLongPress, { delayMs: 400, moveThresholdPx: 10 }),
    );
    const down = mouseEvent({ clientX: 0, clientY: 0, button: 0 });
    const move = mouseEvent({ clientX: 20, clientY: 0 });

    act(() => {
      result.current.onMouseDown(down);
      result.current.onMouseMove(move);
      vi.advanceTimersByTime(500);
    });
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('ignores non-primary mouse buttons and moves without a press', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress(onLongPress, { delayMs: 100 }));

    act(() => {
      result.current.onMouseDown(mouseEvent({ clientX: 0, clientY: 0, button: 2 }));
      result.current.onMouseMove(mouseEvent({ clientX: 40, clientY: 0 }));
      vi.advanceTimersByTime(200);
    });
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('fires after a touch press and cancels when the finger moves', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(onLongPress, { delayMs: 300, moveThresholdPx: 8 }),
    );

    act(() => {
      result.current.onTouchStart(touchEvent(0, 0, { empty: true }));
      vi.advanceTimersByTime(400);
    });
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => {
      result.current.onTouchStart(touchEvent(0, 0));
      result.current.onTouchMove(touchEvent(0, 0, { empty: true }));
      result.current.onTouchMove(touchEvent(30, 0));
      vi.advanceTimersByTime(400);
    });
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => {
      result.current.onTouchStart(touchEvent(1, 1));
      vi.advanceTimersByTime(300);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('prevents the context menu after a long press fires', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPress(onLongPress, { delayMs: 200 }));
    const preventDefault = vi.fn();
    const event = { preventDefault } as unknown as ReactMouseEvent;

    act(() => {
      result.current.onContextMenu(event);
    });
    expect(preventDefault).not.toHaveBeenCalled();

    act(() => {
      result.current.onMouseDown(mouseEvent({ clientX: 0, clientY: 0, button: 0 }));
      vi.advanceTimersByTime(200);
      result.current.onContextMenu(event);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('still fires when movement stays under the threshold', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() =>
      useLongPress(onLongPress, { delayMs: 200, moveThresholdPx: 10 }),
    );

    act(() => {
      result.current.onMouseDown(mouseEvent({ clientX: 0, clientY: 0, button: 0 }));
      result.current.onMouseMove(mouseEvent({ clientX: 3, clientY: 4 }));
      vi.advanceTimersByTime(200);
    });
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
