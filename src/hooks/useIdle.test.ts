import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIdle } from './useIdle';

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('becomes idle after the timeout with no activity', () => {
    const { result } = renderHook(() => useIdle(1000));

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);
  });

  it('resets the idle timer on activity', () => {
    const { result } = renderHook(() => useIdle(1000));

    act(() => {
      vi.advanceTimersByTime(800);
      window.dispatchEvent(new Event('mousemove'));
      vi.advanceTimersByTime(800);
    });

    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(true);
  });
});
