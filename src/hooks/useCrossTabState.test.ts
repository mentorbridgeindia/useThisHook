import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCrossTabState } from './useCrossTabState';

describe('useCrossTabState', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('reads and writes JSON like localStorage', () => {
    const { result } = renderHook(() => useCrossTabState('theme', 'light'));
    expect(result.current[0]).toBe('light');

    act(() => {
      result.current[1]('dark');
    });
    expect(result.current[0]).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe(JSON.stringify('dark'));
  });

  it('updates when another tab writes storage', () => {
    const { result } = renderHook(() => useCrossTabState('theme', 'light'));

    act(() => {
      window.localStorage.setItem('theme', JSON.stringify('sepia'));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme',
          newValue: JSON.stringify('sepia'),
          storageArea: window.localStorage,
        }),
      );
    });
    expect(result.current[0]).toBe('sepia');
  });

  it('falls back when stored JSON is invalid', () => {
    window.localStorage.setItem('theme', '{not-json');
    const { result } = renderHook(() => useCrossTabState('theme', 'light'));
    expect(result.current[0]).toBe('light');
  });

  it('updates from another BroadcastChannel tab and ignores its own source', async () => {
    const listeners = new Set<(event: MessageEvent) => void>();
    class TestChannel {
      addEventListener(_type: string, listener: (event: MessageEvent) => void) {
        listeners.add(listener);
      }
      removeEventListener(_type: string, listener: (event: MessageEvent) => void) {
        listeners.delete(listener);
      }
      postMessage(data: unknown) {
        listeners.forEach((listener) => listener({ data } as MessageEvent));
      }
      close() {
        listeners.clear();
      }
    }
    vi.stubGlobal('BroadcastChannel', TestChannel);

    const { result } = renderHook(() => useCrossTabState('theme', 'light'));
    const channel = new TestChannel();

    await act(async () => {
      channel.postMessage({ key: 'other', value: 'ignored', source: 'tab-b' });
      channel.postMessage({ key: 'theme', value: 'navy', source: 'tab-b' });
    });
    expect(result.current[0]).toBe('navy');
    vi.unstubAllGlobals();
  });

  it('resets on storage clear and invalid storage payloads', () => {
    const { result } = renderHook(() => useCrossTabState('theme', 'light'));

    act(() => {
      result.current[1]('dark');
    });

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme',
          newValue: null,
          storageArea: window.localStorage,
        }),
      );
    });
    expect(result.current[0]).toBe('light');

    act(() => {
      result.current[1]((previous) => `${previous}-ink`);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme',
          newValue: '{broken',
          storageArea: window.localStorage,
        }),
      );
    });
    expect(result.current[0]).toBe('light');
  });

  it('swallows quota errors when writing', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { result } = renderHook(() => useCrossTabState('theme', 'light'));
    act(() => {
      result.current[1]('dark');
    });
    expect(result.current[0]).toBe('dark');
    setItem.mockRestore();
  });

  it('ignores storage events from a different area', () => {
    const { result } = renderHook(() => useCrossTabState('theme', 'light'));
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'theme',
          newValue: JSON.stringify('session'),
          storageArea: window.sessionStorage,
        }),
      );
    });
    expect(result.current[0]).toBe('light');
  });
});
