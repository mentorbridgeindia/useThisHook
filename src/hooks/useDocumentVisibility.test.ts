import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDocumentVisibility } from './useDocumentVisibility';

describe('useDocumentVisibility', () => {
  it('returns the current document visibility state', () => {
    const { result } = renderHook(() => useDocumentVisibility());
    expect(result.current).toBe(document.visibilityState);
  });

  it('updates when visibilitychange fires', () => {
    const { result } = renderHook(() => useDocumentVisibility());

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe('hidden');

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe('visible');
  });

  it('unsubscribes on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useDocumentVisibility());
    expect(addSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
