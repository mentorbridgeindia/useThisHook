import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
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
});
