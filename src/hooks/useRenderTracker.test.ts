import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRenderTracker } from './useRenderTracker';

describe('useRenderTracker', () => {
  it('counts renders and logs when enabled', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const { result, rerender } = renderHook(() => useRenderTracker('Panel', { enabled: true }));

    expect(result.current).toBe(1);
    rerender();
    expect(result.current).toBe(2);
    expect(debug).toHaveBeenCalled();
    debug.mockRestore();
  });

  it('does not log when disabled', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    renderHook(() => useRenderTracker('Panel', { enabled: false }));
    expect(debug).not.toHaveBeenCalled();
    debug.mockRestore();
  });
});
