import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAsyncQueue } from './useAsyncQueue';

describe('useAsyncQueue', () => {
  it('runs tasks with a concurrency cap', async () => {
    const { result } = renderHook(() => useAsyncQueue({ concurrency: 1 }));
    let releaseFirst: () => void = () => undefined;
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });
    const order: number[] = [];

    let first: Promise<number> | undefined;
    let second: Promise<number> | undefined;

    act(() => {
      first = result.current.enqueue(async () => {
        order.push(1);
        await firstGate;
        return 1;
      });
      second = result.current.enqueue(async () => {
        order.push(2);
        return 2;
      });
    });

    expect(order).toEqual([1]);
    expect(result.current.pending).toBe(1);
    expect(result.current.size).toBe(1);

    await act(async () => {
      releaseFirst();
      await first;
      await second;
    });
    expect(order).toEqual([1, 2]);
    expect(result.current.pending).toBe(0);
    expect(result.current.size).toBe(0);
  });

  it('rejects queued work on clear', async () => {
    const { result } = renderHook(() => useAsyncQueue({ concurrency: 1 }));
    let release: () => void = () => undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    let queued: Promise<string> | undefined;
    act(() => {
      void result.current.enqueue(async () => {
        await gate;
        return 'active';
      });
      queued = result.current.enqueue(async () => 'queued');
    });

    act(() => {
      result.current.clear();
    });
    await expect(queued).rejects.toMatchObject({ name: 'AbortError' });

    await act(async () => {
      release();
    });
  });
});
