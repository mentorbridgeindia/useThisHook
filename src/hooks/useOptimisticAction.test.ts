import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useOptimisticAction } from './useOptimisticAction';

describe('useOptimisticAction', () => {
  it('applies an optimistic value then confirms', async () => {
    const { result } = renderHook(() =>
      useOptimisticAction(
        0,
        async (value, delta: number) => value + delta,
        (value, delta: number) => value + delta,
      ),
    );

    await act(async () => {
      await result.current.run(2);
    });
    expect(result.current.value).toBe(4);
    expect(result.current.isPending).toBe(false);
  });

  it('rolls back when the action fails', async () => {
    const { result } = renderHook(() =>
      useOptimisticAction(
        1 as number,
        async () => {
          throw new Error('fail');
        },
        (value) => value + 1,
      ),
    );

    await act(async () => {
      await expect(result.current.run()).rejects.toThrow('fail');
    });
    expect(result.current.value).toBe(1);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('ignores a duplicate submit while pending', async () => {
    let resolveAction: (value: number) => void = () => undefined;
    const pending = new Promise<number>((resolve) => {
      resolveAction = resolve;
    });

    const { result } = renderHook(() =>
      useOptimisticAction(
        0,
        async () => pending,
        (value) => value + 1,
      ),
    );

    act(() => {
      void result.current.run();
      void result.current.run();
    });
    expect(result.current.value).toBe(1);

    await act(async () => {
      resolveAction(5);
      await Promise.resolve();
    });
    expect(result.current.value).toBe(5);
  });
});
