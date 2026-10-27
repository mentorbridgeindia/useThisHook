import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAsyncState } from './useAsyncState';

describe('useAsyncState', () => {
  it('tracks idle, loading, success, and error', async () => {
    const { result } = renderHook(() =>
      useAsyncState(async (signal) => {
        void signal;
        return 42;
      }),
    );

    expect(result.current.status).toBe('idle');
    expect(result.current.isIdle).toBe(true);

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe(42);

    const { result: failing } = renderHook(() =>
      useAsyncState(async () => {
        throw new Error('nope');
      }),
    );

    await act(async () => {
      await expect(failing.current.execute()).rejects.toThrow('nope');
    });
    expect(failing.current.isError).toBe(true);
  });

  it('ignores a stale result when a newer execute starts', async () => {
    let resolveFirst: (value: string) => void = () => undefined;
    const first = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    let call = 0;

    const { result } = renderHook(() =>
      useAsyncState(async () => {
        call += 1;
        if (call === 1) return first;
        return 'second';
      }),
    );

    let firstPromise: Promise<string | undefined> | undefined;
    act(() => {
      firstPromise = result.current.execute();
    });

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.data).toBe('second');

    await act(async () => {
      resolveFirst('first');
      await firstPromise;
    });
    expect(result.current.data).toBe('second');
  });

  it('runs immediately when immediate is true', async () => {
    const { result } = renderHook(() => useAsyncState(async () => 'ready', { immediate: true }));

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.data).toBe('ready');
    expect(result.current.isSuccess).toBe(true);
  });
});
