import type { HookApi } from '../hookDoc';

export const useIntervalApi: HookApi = {
  signature: 'useInterval(callback: () => void, delayMs: number | null): void',
  explanation:
    'Runs callback on a timer, always calling the latest function without resetting the interval. This is a side-effect hook: it does not return a value.',
  arguments: [
    {
      name: 'callback',
      type: '() => void',
      description:
        'Work to run each tick. You can change this every render; the interval still keeps its schedule.',
    },
    {
      name: 'delayMs',
      type: 'number | null',
      description:
        'Milliseconds between ticks. Pass null to pause; passing a number again resumes.',
    },
  ],
  returns: {
    type: 'void',
    description: 'Nothing. Drive UI from your own state that the callback updates.',
  },
  caveats: ['Clearing happens automatically when the component unmounts or delayMs changes.'],
};

export const useCopyToClipboardApi: HookApi = {
  signature: 'useCopyToClipboard()',
  explanation:
    'Wraps navigator.clipboard.writeText and remembers the last string that copied successfully so you can show a “Copied” label.',
  arguments: [],
  returns: {
    type: '{ copiedText, copy, reset }',
    description: 'Clipboard helpers plus the last successful payload.',
    fields: [
      {
        name: 'copiedText',
        type: 'string | null',
        description: 'Last text that copied, or null if none / last copy failed.',
      },
      {
        name: 'copy',
        type: '(text: string) => Promise<boolean>',
        description:
          'Writes text. Resolves true on success, false if the API is missing or the write fails.',
      },
      { name: 'reset', type: '() => void', description: 'Clears copiedText back to null.' },
    ],
  },
  caveats: ['Requires a secure context (HTTPS or localhost) for the Clipboard API.'],
};

export const useLocalStorageApi: HookApi = {
  signature: 'useLocalStorage<T>(key: string, initialValue: T)',
  explanation:
    'Same idea as useState, but the value is JSON-serialized into localStorage under key so it survives refresh.',
  arguments: [
    {
      name: 'key',
      type: 'string',
      description: 'localStorage key. Changing it re-reads that entry.',
    },
    {
      name: 'initialValue',
      type: 'T',
      description: 'Used when the key is missing or stored JSON cannot be parsed.',
    },
  ],
  returns: {
    type: '[value, setValue]',
    description:
      'A state tuple. setValue accepts a value or a function of the previous value, like useState.',
    fields: [
      { name: 'value', type: 'T', description: 'Current parsed value.' },
      {
        name: 'setValue',
        type: '(next: T | ((previous: T) => T)) => void',
        description: 'Writes to React state and localStorage.',
      },
    ],
  },
  caveats: [
    'Values must be JSON-serializable.',
    'Corrupt JSON in storage falls back to initialValue.',
    'Write failures (quota, private mode) are ignored; state still updates in memory.',
  ],
};

export const useSessionStorageApi: HookApi = {
  signature: 'useSessionStorage<T>(key: string, initialValue: T)',
  explanation:
    'Same idea as useLocalStorage, but persists in sessionStorage so the value survives refresh and is cleared when the tab closes.',
  arguments: [
    {
      name: 'key',
      type: 'string',
      description: 'sessionStorage key. Changing it re-reads that entry.',
    },
    {
      name: 'initialValue',
      type: 'T',
      description: 'Used when the key is missing or stored JSON cannot be parsed.',
    },
  ],
  returns: {
    type: '[value, setValue]',
    description:
      'A state tuple. setValue accepts a value or a function of the previous value, like useState.',
    fields: [
      { name: 'value', type: 'T', description: 'Current parsed value.' },
      {
        name: 'setValue',
        type: '(next: T | ((previous: T) => T)) => void',
        description: 'Writes to React state and sessionStorage.',
      },
    ],
  },
  caveats: [
    'Values must be JSON-serializable.',
    'Corrupt JSON in storage falls back to initialValue.',
    'Write failures (quota, private mode) are ignored; state still updates in memory.',
  ],
};
