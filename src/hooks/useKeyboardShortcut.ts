import { useEffect } from 'react';
import { useStableCallback } from './useStableCallback';

export interface UseKeyboardShortcutOptions {
  enabled?: boolean;
  ignoreInputs?: boolean;
  preventDefault?: boolean;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

function isModPlatform() {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

function matchesShortcut(event: KeyboardEvent, shortcut: string) {
  const parts = shortcut
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return false;

  const key = parts[parts.length - 1];
  const modifiers = new Set(parts.slice(0, -1));
  const eventKey = event.key.toLowerCase();
  if (eventKey !== key && event.code.toLowerCase() !== key) return false;

  const wantsMod = modifiers.has('mod');
  const wantsMeta = modifiers.has('meta') || modifiers.has('cmd') || (wantsMod && isModPlatform());
  const wantsCtrl =
    modifiers.has('ctrl') || modifiers.has('control') || (wantsMod && !isModPlatform());
  const wantsAlt = modifiers.has('alt') || modifiers.has('option');
  const wantsShift = modifiers.has('shift');

  return (
    event.metaKey === wantsMeta &&
    event.ctrlKey === wantsCtrl &&
    event.altKey === wantsAlt &&
    event.shiftKey === wantsShift
  );
}

export const useKeyboardShortcut = (
  shortcut: string,
  handler: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {},
) => {
  const { enabled = true, ignoreInputs = true, preventDefault = true } = options;
  const stableHandler = useStableCallback(handler);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (ignoreInputs && isEditableTarget(event.target)) return;
      if (!matchesShortcut(event, shortcut)) return;
      if (preventDefault) event.preventDefault();
      stableHandler(event);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, ignoreInputs, preventDefault, shortcut, stableHandler]);
};
