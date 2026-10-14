import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useSessionStorage } from './useSessionStorage';

const defaultUser = { name: 'unknown' };

describe('useSessionStorage', () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('reads and writes JSON values', () => {
    const { result } = renderHook(() => useSessionStorage('theme', 'light'));
    expect(result.current[0]).toBe('light');

    act(() => {
      result.current[1]('dark');
    });

    expect(result.current[0]).toBe('dark');
    expect(window.sessionStorage.getItem('theme')).toBe(JSON.stringify('dark'));
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useSessionStorage('count', 0));

    act(() => {
      result.current[1]((previous) => previous + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('reads an existing stored value', () => {
    window.sessionStorage.setItem('user', JSON.stringify({ name: 'Ada' }));
    const { result } = renderHook(() => useSessionStorage('user', defaultUser));
    expect(result.current[0]).toEqual({ name: 'Ada' });
  });

  it('falls back when stored JSON is invalid', () => {
    window.sessionStorage.setItem('broken', '{not-json');
    const { result } = renderHook(() => useSessionStorage('broken', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
