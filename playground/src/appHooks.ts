import {
  useAmountInputApi,
  useAsyncActionApi,
  useDebouncedCallbackApi,
  useFieldsApi,
} from './api/appFormApi';
import { useResetStateApi, useStableCallbackApi } from './api/appCoreApi';
import {
  useConfirmApi,
  useListApi,
  usePromptApi,
  useSearchStateApi,
  useSelectionApi,
} from './api/appListApi';
import { UseAsyncActionDemo, useAsyncActionExample } from './demos/UseAsyncActionDemo';
import { UseConfirmDemo, useConfirmExample } from './demos/UseConfirmDemo';
import {
  UseDebouncedCallbackDemo,
  useDebouncedCallbackExample,
} from './demos/UseDebouncedCallbackDemo';
import { UseAmountInputDemo, useAmountInputExample } from './demos/UseAmountInputDemo';
import { UseFieldsDemo, useFieldsExample } from './demos/UseFieldsDemo';
import { UseListDemo, useListExample } from './demos/UseListDemo';
import { UsePromptDemo, usePromptExample } from './demos/UsePromptDemo';
import { UseResetStateDemo, useResetStateExample } from './demos/UseResetStateDemo';
import { UseSearchStateDemo, useSearchStateExample } from './demos/UseSearchStateDemo';
import { UseSelectionDemo, useSelectionExample } from './demos/UseSelectionDemo';
import { UseStableCallbackDemo, useStableCallbackExample } from './demos/UseStableCallbackDemo';
import type { HookEntry } from './hookDoc';

export const appHooks: HookEntry[] = [
  {
    id: 'useStableCallback',
    name: 'useStableCallback',
    summary: 'Stable function identity, always-latest implementation.',
    whenToUse: 'Use in intervals, subscriptions, and memoized children.',
    category: 'App',
    api: useStableCallbackApi,
    Demo: UseStableCallbackDemo,
    example: useStableCallbackExample,
  },
  {
    id: 'useResetState',
    name: 'useResetState',
    summary: 'Local state that resets when the source key changes.',
    whenToUse: 'Use for drafts keyed by user id or record id.',
    category: 'App',
    api: useResetStateApi,
    Demo: UseResetStateDemo,
    example: useResetStateExample,
  },
  {
    id: 'useAsyncAction',
    name: 'useAsyncAction',
    summary: 'Pending, error, and data around one async action.',
    whenToUse: 'Use on Save/Send buttons, not for list fetching.',
    category: 'App',
    api: useAsyncActionApi,
    Demo: UseAsyncActionDemo,
    example: useAsyncActionExample,
  },
  {
    id: 'useDebouncedCallback',
    name: 'useDebouncedCallback',
    summary: 'Debounce calling a function, with cancel.',
    whenToUse: 'Use for search fetch and persist-on-type.',
    category: 'App',
    api: useDebouncedCallbackApi,
    Demo: UseDebouncedCallbackDemo,
    example: useDebouncedCallbackExample,
  },
  {
    id: 'useFields',
    name: 'useFields',
    summary: 'Small form state with setField, dirty, and optional schema.',
    whenToUse: 'Use for modals and settings, not huge RHF forms.',
    category: 'App',
    api: useFieldsApi,
    Demo: UseFieldsDemo,
    example: useFieldsExample,
  },
  {
    id: 'useAmountInput',
    name: 'useAmountInput',
    summary: 'Locale amount input with grouping, decimals, and cursor restore.',
    whenToUse: 'Use for price and invoice fields, not generic text.',
    category: 'App',
    api: useAmountInputApi,
    Demo: UseAmountInputDemo,
    example: useAmountInputExample,
  },
  {
    id: 'useList',
    name: 'useList',
    summary: 'Insert, update, remove, and reorder items with ids.',
    whenToUse: 'Use for todos, attendees, and pipeline stages.',
    category: 'App',
    api: useListApi,
    Demo: UseListDemo,
    example: useListExample,
  },
  {
    id: 'useSelection',
    name: 'useSelection',
    summary: 'Single or multi id selection for lists and tables.',
    whenToUse: 'Use for checkboxes and “select all on this page”.',
    category: 'App',
    api: useSelectionApi,
    Demo: UseSelectionDemo,
    example: useSelectionExample,
  },
  {
    id: 'useSearchState',
    name: 'useSearchState',
    summary: 'URL search params as React state.',
    whenToUse: 'Use for filters, tabs, and page that must be shareable.',
    category: 'App',
    api: useSearchStateApi,
    Demo: UseSearchStateDemo,
    example: useSearchStateExample,
  },
  {
    id: 'useConfirm',
    name: 'useConfirm',
    summary: 'Await a yes/no dialog from a click handler.',
    whenToUse: 'Use before delete or other destructive actions.',
    category: 'App',
    api: useConfirmApi,
    Demo: UseConfirmDemo,
    example: useConfirmExample,
  },
  {
    id: 'usePrompt',
    name: 'usePrompt',
    summary: 'Await a single string from a small dialog.',
    whenToUse: 'Use for rename and “name this view”.',
    category: 'App',
    api: usePromptApi,
    Demo: UsePromptDemo,
    example: usePromptExample,
  },
];
