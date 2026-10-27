import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAsyncQueue } from './useAsyncQueue';

describe('useAsyncQueue', () => {
  it('defaults concurrency to one', async () => {
    const { result } = renderHook(() => useAsyncQueue());
    let done: Promise<string> | undefined;
    await act(async () => {
      done = result.current.enqueue(async () => 'solo');
      await done;
    });
    expect(result.current.pending).toBe(0);
  });

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

  it('rejects a running task without blocking the rest of the queue', async () => {
    const { result } = renderHook(() => useAsyncQueue({ concurrency: 1 }));

    let failed: Promise<string> | undefined;
    let next: Promise<string> | undefined;
    act(() => {
      failed = result.current.enqueue(async () => {
        throw new Error('boom');
      });
      next = result.current.enqueue(async () => 'ok');
    });

    await act(async () => {
      await expect(failed).rejects.toThrow('boom');
      await expect(next).resolves.toBe('ok');
    });
    expect(result.current.pending).toBe(0);
  });
});
