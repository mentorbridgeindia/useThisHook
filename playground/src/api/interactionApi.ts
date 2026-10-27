import type { HookApi } from '../hookDoc';

export const useKeyboardShortcutApi: HookApi = {
  signature: 'useKeyboardShortcut(shortcut, handler, options?)',
  explanation:
    'Listens on window keydown for a combo such as ctrl+k, meta+s, or Escape. Cleans up on unmount. By default ignores typing in inputs and calls preventDefault.',
  arguments: [
    {
      name: 'shortcut',
      type: 'string',
      description: 'Plus-separated combo. Use mod for Command on Apple and Control elsewhere.',
    },
    {
      name: 'handler',
      type: '(event: KeyboardEvent) => void',
      description: 'Called when the combo matches.',
    },
    {
      name: 'options.ignoreInputs',
      type: 'boolean',
      optional: true,
      description: 'Skip INPUT, TEXTAREA, SELECT, and contenteditable. Default true.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      optional: true,
      description: 'Detach the listener when false. Default true.',
    },
  ],
  returns: {
    type: 'void',
    description: 'No return value. The listener is registered for the lifetime of the component.',
  },
};

export const useLongPressApi: HookApi = {
  signature: 'useLongPress(onLongPress, options?)',
  explanation:
    'Returns mouse and touch handlers. After delayMs without moving past moveThresholdPx, onLongPress fires. Spread the handlers onto the target element.',
  arguments: [
    {
      name: 'onLongPress',
      type: '(event: React.MouseEvent | React.TouchEvent) => void',
      description: 'Called once the press is held long enough.',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      optional: true,
      description: 'Hold time. Default 500.',
    },
    {
      name: 'options.moveThresholdPx',
      type: 'number',
      optional: true,
      description: 'Cancel if the pointer moves this far. Default 10.',
    },
  ],
  returns: {
    type: '{ onMouseDown, onMouseUp, onMouseLeave, onMouseMove, onTouchStart, onTouchEnd, onTouchMove, onContextMenu }',
    description: 'Spread onto a button or surface.',
  },
};
