import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useWhyDidYouUpdate } from './useWhyDidYouUpdate';

describe('useWhyDidYouUpdate', () => {
  it('logs changed keys after the first render', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const { rerender } = renderHook(
      ({ count }: { count: number }) => useWhyDidYouUpdate('Row', { count }, { enabled: true }),
      { initialProps: { count: 0 } },
    );

    expect(debug).not.toHaveBeenCalled();
    rerender({ count: 1 });
    expect(debug).toHaveBeenCalledWith('[useWhyDidYouUpdate] Row', {
      count: { from: 0, to: 1 },
    });
    debug.mockRestore();
  });

  it('does not log when disabled', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const { rerender } = renderHook(
      ({ count }: { count: number }) => useWhyDidYouUpdate('Row', { count }, { enabled: false }),
      { initialProps: { count: 0 } },
    );
    rerender({ count: 1 });
    expect(debug).not.toHaveBeenCalled();
    debug.mockRestore();
  });
});
