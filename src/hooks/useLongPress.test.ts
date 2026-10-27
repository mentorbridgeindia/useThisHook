import { act, renderHook } from '@testing-library/react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLongPress } from './useLongPress';

function mouseEvent(init: MouseEventInit) {
  return new MouseEvent('mousedown', init) as unknown as ReactMouseEvent;
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
});
