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

function parseShortcut(shortcut: string) {
  const parts = shortcut
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean);
  return { key: parts.at(-1), modifiers: new Set(parts.slice(0, -1)) };
}

function wantsMeta(modifiers: Set<string>) {
  return modifiers.has('meta') || modifiers.has('cmd') || (modifiers.has('mod') && isModPlatform());
}

function wantsCtrl(modifiers: Set<string>) {
  return (
    modifiers.has('ctrl') || modifiers.has('control') || (modifiers.has('mod') && !isModPlatform())
  );
}

function matchesShortcut(event: KeyboardEvent, shortcut: string) {
  const { key, modifiers } = parseShortcut(shortcut);
  if (!key) return false;

  const eventKey = event.key.toLowerCase();
  if (eventKey !== key && event.code.toLowerCase() !== key) return false;

  return (
    event.metaKey === wantsMeta(modifiers) &&
    event.ctrlKey === wantsCtrl(modifiers) &&
    event.altKey === (modifiers.has('alt') || modifiers.has('option')) &&
    event.shiftKey === modifiers.has('shift')
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
