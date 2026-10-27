import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useOnlineQueue } from './useOnlineQueue';

describe('useOnlineQueue', () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'onLine');

  afterEach(() => {
    if (originalDescriptor) Object.defineProperty(window.navigator, 'onLine', originalDescriptor);
  });

  it('holds items while offline and flushes when online', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });

    const processItem = vi.fn(async () => undefined);
    const { result } = renderHook(() => useOnlineQueue<string>(processItem));

    act(() => {
      result.current.enqueue('a');
      result.current.enqueue('b');
    });
    expect(result.current.items).toEqual(['a', 'b']);
    expect(processItem).not.toHaveBeenCalled();

    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
    await act(async () => {
      window.dispatchEvent(new Event('online'));
      await Promise.resolve();
    });

    expect(processItem).toHaveBeenCalledTimes(2);
    expect(result.current.items).toEqual([]);
  });

  it('keeps the remaining items when process throws', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });

    const processItem = vi.fn(async (item: string) => {
      if (item === 'bad') throw new Error('nope');
    });
    const { result } = renderHook(() => useOnlineQueue(processItem));

    await act(async () => {
      result.current.enqueue('bad');
      result.current.enqueue('ok');
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.items[0]).toBe('bad');
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
