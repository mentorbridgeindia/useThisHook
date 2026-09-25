import type { HookApi } from '../hookDoc';

export const useAsyncActionApi: HookApi = {
  signature: 'useAsyncAction(action)',
  explanation:
    'Wraps one async function for button UIs: pending, last data, last error, and run(). A newer run ignores an older result. This is not a shared cache.',
  arguments: [
    {
      name: 'action',
      type: '(...args: TArgs) => Promise<TResult>',
      description: 'The work to run. The hook always calls the latest version.',
    },
  ],
  returns: {
    type: '{ run, isPending, error, data, reset }',
    description: 'Call run from a click handler. Disable the button with isPending.',
    fields: [
      {
        name: 'run',
        type: '(...args) => Promise<TResult>',
        description: 'Starts the action. Re-throws if action throws.',
      },
      {
        name: 'isPending',
        type: 'boolean',
        description: 'True while the latest run is in flight.',
      },
      {
        name: 'error',
        type: 'unknown | null',
        description: 'Rejection from the latest finished run, or null.',
      },
      {
        name: 'data',
        type: 'TResult | undefined',
        description: 'Resolution from the latest successful run.',
      },
      {
        name: 'reset',
        type: '() => void',
        description: 'Clears pending, error, and data and invalidates in-flight runs.',
      },
    ],
  },
};

export const useDebouncedCallbackApi: HookApi = {
  signature: 'useDebouncedCallback(callback, delayMs)',
  explanation:
    'Returns a function that waits delayMs after the last call before running callback. Also returns cancel to drop a pending call.',
  arguments: [
    {
      name: 'callback',
      type: '(...args) => void',
      description: 'The work to run after idle time. Latest callback is used.',
    },
    { name: 'delayMs', type: 'number', description: 'Idle time in milliseconds.' },
  ],
  returns: {
    type: '[run, cancel]',
    description: 'A tuple: the debounced function and a cancel function.',
    fields: [
      {
        name: 'run',
        type: 'T',
        description: 'Call this from events. Restarts the timer each time.',
      },
      {
        name: 'cancel',
        type: '() => void',
        description: 'Clears the timer so callback will not run.',
      },
    ],
  },
};

export const useAmountInputApi: HookApi = {
  signature: 'useAmountInput({ language, decimalCount, defaultValue })',
  explanation:
    'Formats a money-like input as the user types: thousand separators, locale decimal, and a stable cursor. Bind displayValue, onChange, onBlur, and ref to the input. value is the canonical string for submit (dot decimal, no grouping).',
  arguments: [
    {
      name: 'language',
      type: "'en' | 'de' | 'nl' | 'fr'",
      description:
        'Picks grouping and decimal characters (en: 1,234.56; fr/de: 1 234,56; nl: 1.234,56).',
    },
    {
      name: 'decimalCount',
      type: 'number',
      description: 'Maximum digits after the decimal. Extra fractional digits are dropped.',
    },
    {
      name: 'defaultValue',
      type: 'string | number | null',
      optional: true,
      defaultValue: "''",
      description: 'Starting canonical amount. reset() returns here.',
    },
  ],
  returns: {
    type: '{ value, displayValue, onChange, onBlur, ref, reset, updateValue }',
    description: 'Pass displayValue and the handlers to the input. Read value when you persist.',
    fields: [
      {
        name: 'value',
        type: 'string',
        description: 'Unformatted canonical amount, e.g. "12345.67". Empty string when blank.',
      },
      {
        name: 'displayValue',
        type: 'string',
        description: 'Formatted text for the input, e.g. "12 345,67".',
      },
      {
        name: 'onChange',
        type: '(event) => void',
        description: 'Normalizes, formats, and restores the cursor after grouping changes.',
      },
      {
        name: 'onBlur',
        type: '(event) => void',
        description: 'Re-normalizes the current display on blur.',
      },
      {
        name: 'ref',
        type: 'RefCallback<HTMLInputElement>',
        description: 'Required so the hook can restore selection after format.',
      },
      { name: 'reset', type: '() => void', description: 'Restores defaultValue.' },
      {
        name: 'updateValue',
        type: '(value) => void',
        description: 'Set from outside (number, string, null). Replaces the field.',
      },
    ],
  },
  caveats: [
    'Attach the returned ref. Cursor restoration reads the live input node.',
    'value is not what you put in the input. Bind displayValue.',
    'Changing language or decimalCount does not rewrite an in-progress value; remount or call updateValue.',
  ],
};

export const useFieldsApi: HookApi = {
  signature: 'useFields(initialValues, schema?)',
  explanation:
    'One object of form values with setField, dirty tracking, and optional schema.safeParse (Zod-compatible). submit(onValid) only runs onValid when parse succeeds.',
  arguments: [
    {
      name: 'initialValues',
      type: 'T extends object',
      description: 'Starting values. Keep this object stable or isDirty will flicker.',
    },
    {
      name: 'schema',
      type: '{ safeParse(data) => { success, data } | { success: false, error: { issues } } }',
      optional: true,
      description: 'Zod schemas work. Issues use path[0] as the field name.',
    },
  ],
  returns: {
    type: '{ values, setField, setValues, reset, isDirty, errors, validate, submit }',
    description: 'Bind inputs to values and setField. Show errors[field] under the input.',
    fields: [
      { name: 'values', type: 'T', description: 'Current field values.' },
      {
        name: 'setField',
        type: '(key, value) => void',
        description: 'Updates one key and clears that key’s error.',
      },
      {
        name: 'setValues',
        type: 'Dispatch<SetStateAction<T>>',
        description: 'Replace or functional-update the whole object.',
      },
      { name: 'reset', type: '() => void', description: 'Back to initialValues, no errors.' },
      {
        name: 'isDirty',
        type: 'boolean',
        description: 'True when any value differs (shallow) from initialValues.',
      },
      {
        name: 'errors',
        type: 'Partial<Record<keyof T, string>>',
        description: 'First message per field from the last validate/submit.',
      },
      {
        name: 'validate',
        type: '() => { ok, values } | { ok, errors }',
        description: 'Runs schema if present.',
      },
      {
        name: 'submit',
        type: '(onValid) => result',
        description: 'Validates, then calls onValid(values) only when ok.',
      },
    ],
  },
};
