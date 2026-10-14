import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useScrollLock } from './useScrollLock';

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('locks body scroll by default and unlocks on unmount', () => {
    const { result, unmount } = renderHook(() => useScrollLock());

    expect(result.current.isLocked).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('supports manual lock and unlock when autoLock is false', () => {
    const { result } = renderHook(() => useScrollLock({ autoLock: false }));

    expect(result.current.isLocked).toBe(false);
    expect(document.body.style.overflow).toBe('');

    act(() => {
      result.current.lock();
    });
    expect(result.current.isLocked).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    act(() => {
      result.current.unlock();
    });
    expect(result.current.isLocked).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });
});
