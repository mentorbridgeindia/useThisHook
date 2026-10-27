import type { HookApi } from '../hookDoc';

export const useRenderTrackerApi: HookApi = {
  signature: 'useRenderTracker(label, options?)',
  explanation:
    'Increments a render counter each time the component function runs. In development it logs after commit. Pass enabled: false (or rely on production NODE_ENV) to skip logging.',
  arguments: [
    { name: 'label', type: 'string', description: 'Name printed in the console.' },
    {
      name: 'options.enabled',
      type: 'boolean',
      optional: true,
      description: 'Default: process.env.NODE_ENV !== "production".',
    },
  ],
  returns: {
    type: 'number',
    description: 'How many times this hook instance has rendered.',
  },
};

export const useWhyDidYouUpdateApi: HookApi = {
  signature: 'useWhyDidYouUpdate(label, props, options?)',
  explanation:
    'Compares the props object to the previous render and logs keys whose values changed by Object.is. Disabled in production unless you pass enabled: true.',
  arguments: [
    { name: 'label', type: 'string', description: 'Name printed in the console.' },
    {
      name: 'props',
      type: 'Record<string, unknown>',
      description: 'Values to diff, usually props or a state snapshot.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      optional: true,
      description: 'Default: process.env.NODE_ENV !== "production".',
    },
  ],
  returns: {
    type: 'void',
    description: 'No return value. Output goes to console.debug.',
  },
};
