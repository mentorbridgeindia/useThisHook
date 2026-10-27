import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useKeyboardShortcut } from './useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  it('fires on a matching combo and ignores inputs by default', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('ctrl+k', handler));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });
    expect(handler).toHaveBeenCalledTimes(1);

    const input = document.createElement('input');
    document.body.appendChild(input);
    const typed = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
    Object.defineProperty(typed, 'target', { value: input });
    act(() => {
      window.dispatchEvent(typed);
    });
    expect(handler).toHaveBeenCalledTimes(1);
    input.remove();
  });

  it('does not fire when disabled', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('Escape', handler, { enabled: false }));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(handler).not.toHaveBeenCalled();
  });
});
