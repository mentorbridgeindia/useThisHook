import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useInstallPrompt } from './useInstallPrompt';

describe('useInstallPrompt', () => {
  it('defers beforeinstallprompt and reports the user choice', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.isReady).toBe(false);

    const prompt = vi.fn(async () => undefined);
    const event = new Event('beforeinstallprompt');
    Object.assign(event, {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
      preventDefault: vi.fn(),
    });

    act(() => {
      window.dispatchEvent(event);
    });
    expect(result.current.isReady).toBe(true);

    let outcome: string | undefined;
    await act(async () => {
      outcome = await result.current.prompt();
    });
    expect(prompt).toHaveBeenCalled();
    expect(outcome).toBe('accepted');
    expect(result.current.isReady).toBe(false);
    expect(result.current.isInstalled).toBe(true);
  });

  it('returns unavailable when there is no deferred prompt', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    await act(async () => {
      await expect(result.current.prompt()).resolves.toBe('unavailable');
    });
  });
});
