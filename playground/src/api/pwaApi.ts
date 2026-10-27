import type { HookApi } from '../hookDoc';

export const useOnlineQueueApi: HookApi = {
  signature: 'useOnlineQueue(processItem)',
  explanation:
    'Queue values while the browser is offline. When online, items drain FIFO through processItem. If processItem throws, the failed item stays at the front.',
  arguments: [
    {
      name: 'processItem',
      type: '(item: T) => Promise<void>',
      description: 'Called for each queued item when the browser reports online.',
    },
  ],
  returns: {
    type: '{ enqueue, items, isOnline, isFlushing, error, flush }',
    description: 'In-memory queue plus flush controls. Not persisted across refresh.',
  },
};

export const useStorageQuotaApi: HookApi = {
  signature: 'useStorageQuota()',
  explanation:
    'Reads navigator.storage.estimate() after mount. Safe when the API is missing (SSR, older browsers).',
  arguments: [],
  returns: {
    type: '{ usage, quota, usageRatio, isSupported, refresh }',
    description: 'Bytes used and allowed, or nulls when unsupported.',
    fields: [
      { name: 'usage', type: 'number | null', description: 'Bytes used.' },
      { name: 'quota', type: 'number | null', description: 'Bytes allowed.' },
      { name: 'usageRatio', type: 'number | null', description: 'usage / quota, or null.' },
      { name: 'isSupported', type: 'boolean', description: 'Whether estimate() exists.' },
      { name: 'refresh', type: '() => Promise<void>', description: 'Read estimate again.' },
    ],
  },
};

export const useInstallPromptApi: HookApi = {
  signature: 'useInstallPrompt()',
  explanation:
    'Captures beforeinstallprompt (Chromium), lets you call prompt() later, and tracks appinstalled / display-mode standalone.',
  arguments: [],
  returns: {
    type: '{ isReady, isInstalled, isSupported, prompt }',
    description: 'PWA install prompt state.',
    fields: [
      { name: 'isReady', type: 'boolean', description: 'A deferred prompt is available.' },
      {
        name: 'isInstalled',
        type: 'boolean',
        description: 'Standalone display or appinstalled fired.',
      },
      {
        name: 'prompt',
        type: "() => Promise<'accepted' | 'dismissed' | 'unavailable'>",
        description: 'Shows the native install UI when ready.',
      },
    ],
  },
  caveats: ['Safari and Firefox do not fire beforeinstallprompt. isReady stays false there.'],
};

export const useCrossTabStateApi: HookApi = {
  signature: 'useCrossTabState(key, initialValue)',
  explanation:
    'useState that writes JSON to localStorage and syncs other tabs via BroadcastChannel and the storage event. Same tab already has the new value from the setter.',
  arguments: [
    { name: 'key', type: 'string', description: 'localStorage key.' },
    {
      name: 'initialValue',
      type: 'T',
      description: 'Used when the key is empty or JSON is invalid.',
    },
  ],
  returns: {
    type: '[value, setValue]',
    description: 'Tuple like useState, including functional updates.',
  },
};
