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

  it('stops when retryIf returns false', async () => {
    let calls = 0;
    const { result } = renderHook(() =>
      useRetry(
        async () => {
          calls += 1;
          throw new Error('nope');
        },
        { retries: 5, delayMs: 10, retryIf: () => false },
      ),
    );

    let done: Promise<string> | undefined;
    act(() => {
      done = result.current.run();
    });

    await expect(done).rejects.toThrow('nope');
    expect(calls).toBe(1);
  });

  it('uses a constant delay between attempts', async () => {
    let calls = 0;
    const { result } = renderHook(() =>
      useRetry(
        async () => {
          calls += 1;
          if (calls < 2) throw new Error('retry');
          return 'ok';
        },
        { retries: 2, delayMs: 50, backoff: 'constant' },
      ),
    );

    let done: Promise<string> | undefined;
    act(() => {
      done = result.current.run();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });

    await expect(done).resolves.toBe('ok');
  });

  it('maps AbortError from the task and cancel-after-success to AbortError', async () => {
    const { result } = renderHook(() =>
      useRetry(async () => {
        const error = new Error('stop');
        error.name = 'AbortError';
        throw error;
      }),
    );

    let aborted: Promise<string> | undefined;
    act(() => {
      aborted = result.current.run();
    });
    await expect(aborted).rejects.toMatchObject({ name: 'AbortError' });

    const { result: succeeding } = renderHook(() =>
      useRetry(async () => {
        queueMicrotask(() => succeeding.current.cancel());
        return 'ok';
      }),
    );

    let cancelled: Promise<string> | undefined;
    act(() => {
      cancelled = succeeding.current.run();
    });
    await expect(cancelled).rejects.toMatchObject({ name: 'AbortError' });
  });
});
