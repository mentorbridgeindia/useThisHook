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

  it('ignores contenteditable and select targets', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('ctrl+k', handler));

    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    Object.defineProperty(editable, 'isContentEditable', { value: true });
    document.body.appendChild(editable);
    const typed = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
    Object.defineProperty(typed, 'target', { value: editable });
    act(() => {
      window.dispatchEvent(typed);
    });
    expect(handler).not.toHaveBeenCalled();
    editable.remove();

    const select = document.createElement('select');
    document.body.appendChild(select);
    const fromSelect = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
    Object.defineProperty(fromSelect, 'target', { value: select });
    act(() => {
      window.dispatchEvent(fromSelect);
    });
    expect(handler).not.toHaveBeenCalled();
    select.remove();
  });

  it('matches empty shortcuts as a no-op and supports preventDefault off', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('   ', handler));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k' }));
    });
    expect(handler).not.toHaveBeenCalled();

    const withCode = vi.fn();
    renderHook(() => useKeyboardShortcut('ctrl+keyk', withCode, { preventDefault: false }));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', code: 'KeyK', ctrlKey: true }));
    });
    expect(withCode).toHaveBeenCalledTimes(1);
  });

  it('matches mod shortcuts on Apple platforms and ignores non-matching keys', () => {
    const platform = Object.getOwnPropertyDescriptor(Navigator.prototype, 'platform');
    Object.defineProperty(navigator, 'platform', { configurable: true, value: 'MacIntel' });

    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('mod+k', handler));
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    });
    expect(handler).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', code: 'KeyJ', metaKey: true }));
    });
    expect(handler).toHaveBeenCalledTimes(1);

    if (platform) Object.defineProperty(Navigator.prototype, 'platform', platform);
    else delete (navigator as { platform?: string }).platform;
  });
});
