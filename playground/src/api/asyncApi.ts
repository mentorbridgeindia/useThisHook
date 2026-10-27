import type { HookApi } from '../hookDoc';

export const useAsyncStateApi: HookApi = {
  signature: 'useAsyncState(fn, options?)',
  explanation:
    'Typed idle / loading / success / error around an async function. A newer execute aborts the previous run. Pass immediate to fetch on mount, and source to refetch when a key changes.',
  arguments: [
    {
      name: 'fn',
      type: '(signal: AbortSignal) => Promise<T>',
      description: 'The work to run. Honor signal.aborted when you can.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      optional: true,
      description: 'Run once on mount (and when source changes). Default false.',
    },
    {
      name: 'options.source',
      type: 'unknown',
      optional: true,
      description: 'When this value changes and immediate is true, execute again.',
    },
  ],
  returns: {
    type: '{ status, data, error, isIdle, isLoading, isSuccess, isError, execute, abort, reset }',
    description: 'Discriminated-style status flags plus controls.',
    fields: [
      {
        name: 'status',
        type: "'idle' | 'loading' | 'success' | 'error'",
        description: 'Current phase.',
      },
      {
        name: 'execute',
        type: '() => Promise<T | undefined>',
        description: 'Starts a new run and aborts the previous one.',
      },
      {
        name: 'abort',
        type: '() => void',
        description: 'Aborts the in-flight run without resetting data.',
      },
      { name: 'reset', type: '() => void', description: 'Aborts and returns to idle.' },
    ],
  },
};

export const useOptimisticActionApi: HookApi = {
  signature: 'useOptimisticAction(initialValue, action, optimistic)',
  explanation:
    'Applies optimistic() immediately, then awaits action(). On success the confirmed value replaces it. On failure the previous value is restored. A second run while pending is ignored.',
  arguments: [
    { name: 'initialValue', type: 'TState', description: 'Starting value.' },
    {
      name: 'action',
      type: '(value: TState, ...args) => Promise<TState>',
      description: 'Server or async confirmation. Receives the optimistic value.',
    },
    {
      name: 'optimistic',
      type: '(value: TState, ...args) => TState',
      description: 'Synchronous next value shown before action resolves.',
    },
  ],
  returns: {
    type: '{ value, run, isPending, error, reset }',
    description: 'Optimistic state and a run() that rolls back on failure.',
  },
};

export const useRetryApi: HookApi = {
  signature: 'useRetry(fn, options?)',
  explanation:
    'Calls fn and retries on failure with constant or exponential backoff. cancel() aborts waiting between attempts.',
  arguments: [
    { name: 'fn', type: '(...args) => Promise<T>', description: 'The work to retry.' },
    {
      name: 'options.retries',
      type: 'number',
      optional: true,
      description: 'Extra attempts after the first. Default 3.',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      optional: true,
      description: 'Base delay between attempts. Default 250.',
    },
    {
      name: 'options.backoff',
      type: "'constant' | 'exponential'",
      optional: true,
      description: 'Default exponential.',
    },
  ],
  returns: {
    type: '{ run, cancel, isPending, attempt, error }',
    description: 'run() starts the loop. cancel() stops further retries.',
  },
};

export const useAsyncQueueApi: HookApi = {
  signature: 'useAsyncQueue(options?)',
  explanation:
    'FIFO queue of async tasks with a concurrency cap. enqueue() returns the task promise. clear() rejects work still waiting, not work already running.',
  arguments: [
    {
      name: 'options.concurrency',
      type: 'number',
      optional: true,
      description: 'How many tasks may run at once. Default 1.',
    },
  ],
  returns: {
    type: '{ enqueue, size, pending, clear }',
    description: 'Queue controls.',
    fields: [
      {
        name: 'enqueue',
        type: '<T>(task) => Promise<T>',
        description: 'Adds work and starts it when a slot is free.',
      },
      { name: 'size', type: 'number', description: 'Tasks waiting.' },
      { name: 'pending', type: 'number', description: 'Tasks running.' },
      { name: 'clear', type: '() => void', description: 'Reject waiting tasks with AbortError.' },
    ],
  },
};

export const usePollingApi: HookApi = {
  signature: 'usePolling(fn, intervalMs, options?)',
  explanation:
    'Calls fn on an interval. Pass null to pause. By default polling stops while the tab is hidden and the previous tick is aborted when a new one starts or the effect cleans up.',
  arguments: [
    {
      name: 'fn',
      type: '(signal: AbortSignal) => void | Promise<void>',
      description: 'Work for each tick.',
    },
    {
      name: 'intervalMs',
      type: 'number | null',
      description: 'Delay between ticks, or null to pause.',
    },
    {
      name: 'options.pauseWhenHidden',
      type: 'boolean',
      optional: true,
      description: 'Pause when document.visibilityState is hidden. Default true.',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      optional: true,
      description: 'Run once immediately. Default true.',
    },
  ],
  returns: {
    type: '{ isPolling, error }',
    description: 'Whether the interval is active, and the last tick error.',
  },
};
