import type { HookApi } from '../hookDoc';

export const useBooleanApi: HookApi = {
  signature: 'useBoolean(initialValue: boolean)',
  explanation:
    'Keeps a boolean in React state and returns helpers so you can flip, force on, or force off without writing setState yourself.',
  arguments: [
    {
      name: 'initialValue',
      type: 'boolean',
      description: 'Required starting value: true or false.',
    },
  ],
  returns: {
    type: '{ value, toggle, setTrue, setFalse, setValue }',
    description: 'The current flag plus stable callbacks to change it.',
    fields: [
      { name: 'value', type: 'boolean', description: 'Whether the flag is currently on.' },
      {
        name: 'toggle',
        type: '() => void',
        description: 'Flips value from true to false or the reverse.',
      },
      { name: 'setTrue', type: '() => void', description: 'Sets value to true.' },
      { name: 'setFalse', type: '() => void', description: 'Sets value to false.' },
      {
        name: 'setValue',
        type: 'Dispatch<SetStateAction<boolean>>',
        description: 'Escape hatch for any boolean update, including functional updates.',
      },
    ],
  },
};

export const useDisclosureApi: HookApi = {
  signature: 'useDisclosure(initialOpen?: boolean)',
  explanation:
    'Named open/close/toggle helpers for UI that has a visible and hidden state, such as menus, drawers, and dialogs.',
  arguments: [
    {
      name: 'initialOpen',
      type: 'boolean',
      optional: true,
      defaultValue: 'false',
      description: 'Whether the surface starts visible.',
    },
  ],
  returns: {
    type: '{ isOpen, open, close, toggle }',
    description: 'Visibility flag and the three actions you typically wire to buttons.',
    fields: [
      { name: 'isOpen', type: 'boolean', description: 'True while the surface should be shown.' },
      { name: 'open', type: '() => void', description: 'Shows the surface.' },
      { name: 'close', type: '() => void', description: 'Hides the surface.' },
      { name: 'toggle', type: '() => void', description: 'Flips isOpen.' },
    ],
  },
};

export const useDebounceApi: HookApi = {
  signature: 'useDebounce<T>(value: T, delayMs?: number): T',
  explanation:
    'Returns a copy of value that only updates after value has stayed still for delayMs. The first render returns the original value immediately.',
  arguments: [
    {
      name: 'value',
      type: 'T',
      description: 'The rapidly changing source, such as an input string.',
    },
    {
      name: 'delayMs',
      type: 'number',
      optional: true,
      defaultValue: '300',
      description: 'Idle time in milliseconds before the returned value catches up.',
    },
  ],
  returns: {
    type: 'T',
    description: 'The lagged value. Use this for search queries, filters, or expensive work.',
  },
};

export const useThrottleApi: HookApi = {
  signature: 'useThrottle<T>(value: T, delayMs?: number): T',
  explanation:
    'Returns a copy of value that updates at most once per delayMs. The first change in a window applies immediately; a trailing update keeps the latest value.',
  arguments: [
    {
      name: 'value',
      type: 'T',
      description: 'The rapidly changing source, such as scroll position or input text.',
    },
    {
      name: 'delayMs',
      type: 'number',
      optional: true,
      defaultValue: '300',
      description: 'Minimum milliseconds between updates.',
    },
  ],
  returns: {
    type: 'T',
    description:
      'The throttled value. Prefer this over debounce when you need periodic updates while typing or scrolling.',
  },
};
