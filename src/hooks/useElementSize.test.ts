import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useElementSize } from './useElementSize';

describe('useElementSize', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('observes the attached node and reports contentRect size', () => {
    let notify: ResizeObserverCallback | null = null;
    const disconnect = vi.fn();
    const observe = vi.fn();
    const fakeObserver = {} as ResizeObserver;

    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notify = callback;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    const { result, unmount } = renderHook(() => useElementSize());
    const node = document.createElement('div');

    act(() => {
      result.current.ref(node);
    });

    expect(observe).toHaveBeenCalledWith(node);

    act(() => {
      notify?.(
        [{ contentRect: { width: 120, height: 80 } }] as ResizeObserverEntry[],
        fakeObserver,
      );
    });
    expect(result.current.width).toBe(120);
    expect(result.current.height).toBe(80);

    act(() => {
      notify?.([], fakeObserver);
    });
    expect(result.current.width).toBe(120);

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('skips observing when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined);

    const { result } = renderHook(() => useElementSize());
    const node = document.createElement('div');

    act(() => {
      result.current.ref(node);
    });

    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
  });
});
