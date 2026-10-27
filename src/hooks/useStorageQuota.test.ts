import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useStorageQuota } from './useStorageQuota';

describe('useStorageQuota', () => {
  const originalStorage = navigator.storage;

  afterEach(() => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: originalStorage,
    });
  });

  it('reports unsupported when estimate is missing', async () => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useStorageQuota());
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.isSupported).toBe(false);
    expect(result.current.usage).toBeNull();
  });

  it('reads usage and quota from storage.estimate', async () => {
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        estimate: vi.fn(async () => ({ usage: 25, quota: 100 })),
      },
    });

    const { result } = renderHook(() => useStorageQuota());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isSupported).toBe(true);
    expect(result.current.usage).toBe(25);
    expect(result.current.quota).toBe(100);
    expect(result.current.usageRatio).toBe(0.25);
  });
});
