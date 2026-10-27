import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePolling } from './usePolling';

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('polls on an interval and stops when delay is null', async () => {
    const fn = vi.fn(async () => undefined);
    const { result, rerender } = renderHook(
      ({ delay }: { delay: number | null }) => usePolling(fn, delay),
      { initialProps: { delay: 1000 as number | null } },
    );

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.isPolling).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(fn).toHaveBeenCalledTimes(2);

    rerender({ delay: null });
    expect(result.current.isPolling).toBe(false);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('pauses while the document is hidden', async () => {
    const fn = vi.fn(async () => undefined);
    renderHook(() => usePolling(fn, 500, { pauseWhenHidden: true }));
    expect(fn).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
