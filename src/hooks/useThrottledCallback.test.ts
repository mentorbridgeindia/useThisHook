import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useThrottledCallback } from './useThrottledCallback';

describe('useThrottledCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes immediately then throttles, with a trailing call', () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(spy, 200));

    act(() => {
      result.current[0]('a');
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');

    act(() => {
      result.current[0]('b');
      result.current[0]('c');
    });
    expect(spy).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('c');
  });

  it('can cancel a pending trailing call', () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(spy, 200));

    act(() => {
      result.current[0]('a');
      result.current[0]('b');
      result.current[1]();
      vi.advanceTimersByTime(200);
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');
  });
});
