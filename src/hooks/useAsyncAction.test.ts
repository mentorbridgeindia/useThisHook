import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAsyncAction } from './useAsyncAction';

describe('useAsyncAction', () => {
  it('tracks pending, data, and error for an async callback', async () => {
    const { result } = renderHook(() =>
      useAsyncAction(async (value: number) => {
        if (value < 0) throw new Error('nope');
        return value * 2;
      }),
    );

    await act(async () => {
      await result.current.run(2);
    });
    expect(result.current.data).toBe(4);
    expect(result.current.isPending).toBe(false);

    await act(async () => {
      await expect(result.current.run(-1)).rejects.toThrow('nope');
    });
    expect(result.current.error).toBeInstanceOf(Error);

    act(() => {
      result.current.reset();
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('ignores stale results when a newer run starts', async () => {
    let resolveFirst: (value: string) => void = () => undefined;
    const first = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });
    let call = 0;

    const { result } = renderHook(() =>
      useAsyncAction(async () => {
        call += 1;
        if (call === 1) return first;
        return 'second';
      }),
    );

    let firstPromise: Promise<string> | undefined;
    act(() => {
      firstPromise = result.current.run();
    });

    await act(async () => {
      await result.current.run();
    });
    expect(result.current.data).toBe('second');

    await act(async () => {
      resolveFirst('first');
      await firstPromise;
    });
    expect(result.current.data).toBe('second');
  });
});
