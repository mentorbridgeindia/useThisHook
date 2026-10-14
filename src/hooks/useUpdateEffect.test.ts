import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useUpdateEffect } from './useUpdateEffect';

describe('useUpdateEffect', () => {
  it('does not run on the first mount', () => {
    const effect = vi.fn();

    renderHook(({ value }) => useUpdateEffect(effect, [value]), {
      initialProps: { value: 0 },
    });

    expect(effect).not.toHaveBeenCalled();
  });

  it('runs when a dependency changes after mount', () => {
    const effect = vi.fn();

    const { rerender } = renderHook(({ value }) => useUpdateEffect(effect, [value]), {
      initialProps: { value: 0 },
    });

    expect(effect).not.toHaveBeenCalled();

    rerender({ value: 1 });
    expect(effect).toHaveBeenCalledTimes(1);

    rerender({ value: 2 });
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it('runs cleanup from the previous update before the next effect', () => {
    const cleanup = vi.fn();
    const effect = vi.fn(() => cleanup);

    const { rerender } = renderHook(({ value }) => useUpdateEffect(effect, [value]), {
      initialProps: { value: 0 },
    });

    rerender({ value: 1 });
    expect(effect).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();

    rerender({ value: 2 });
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it('runs the latest cleanup on unmount', () => {
    const cleanup = vi.fn();
    const effect = vi.fn(() => cleanup);

    const { rerender, unmount } = renderHook(({ value }) => useUpdateEffect(effect, [value]), {
      initialProps: { value: 0 },
    });

    act(() => {
      rerender({ value: 1 });
    });
    expect(cleanup).not.toHaveBeenCalled();

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
