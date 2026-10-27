import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRetry } from './useRetry';

describe('useRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retries with exponential backoff then succeeds', async () => {
    let calls = 0;
    const { result } = renderHook(() =>
      useRetry(
        async () => {
          calls += 1;
          if (calls < 3) throw new Error('retry');
          return 'ok';
        },
        { retries: 3, delayMs: 100, backoff: 'exponential', factor: 2 },
      ),
    );

    let done: Promise<string> | undefined;
    act(() => {
      done = result.current.run();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(200);
    });

    await expect(done).resolves.toBe('ok');
    expect(calls).toBe(3);
  });

  it('stops retrying when cancel is called', async () => {
    const { result } = renderHook(() =>
      useRetry(
        async () => {
          throw new Error('retry');
        },
        { retries: 5, delayMs: 1000 },
      ),
    );

    let done: Promise<string> | undefined;
    act(() => {
      done = result.current.run();
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.cancel();
    });

    await expect(done).rejects.toMatchObject({ name: 'AbortError' });
  });
});
