import {
  useCopyToClipboardApi,
  useIntervalApi,
  useLocalStorageApi,
  useSessionStorageApi,
} from './api/persistApi';
import {
  useBooleanApi,
  useDebounceApi,
  useDisclosureApi,
  useThrottleApi,
} from './api/coreStateApi';
import { UseBooleanDemo, useBooleanExample } from './demos/UseBooleanDemo';
import { UseCopyToClipboardDemo, useCopyToClipboardExample } from './demos/UseCopyToClipboardDemo';
import { UseDebounceDemo, useDebounceExample } from './demos/UseDebounceDemo';
import { UseDisclosureDemo, useDisclosureExample } from './demos/UseDisclosureDemo';
import { UseIntervalDemo, useIntervalExample } from './demos/UseIntervalDemo';
import { UseLocalStorageDemo, useLocalStorageExample } from './demos/UseLocalStorageDemo';
import { UseSessionStorageDemo, useSessionStorageExample } from './demos/UseSessionStorageDemo';
import { UseThrottleDemo, useThrottleExample } from './demos/UseThrottleDemo';
import type { HookEntry } from './hookDoc';

export const stateHooks: HookEntry[] = [
  {
    id: 'useBoolean',
    name: 'useBoolean',
    summary: 'Boolean state with toggle helpers.',
    whenToUse: 'Use for panels, switches, and any on/off UI.',
    category: 'State',
    api: useBooleanApi,
    Demo: UseBooleanDemo,
    example: useBooleanExample,
  },
  {
    id: 'useDisclosure',
    name: 'useDisclosure',
    summary: 'Open, close, and toggle for menus and dialogs.',
    whenToUse: 'Use when UI has an explicit open/closed lifecycle.',
    category: 'State',
    api: useDisclosureApi,
    Demo: UseDisclosureDemo,
    example: useDisclosureExample,
  },
  {
    id: 'useDebounce',
    name: 'useDebounce',
    summary: 'Delay updates until the value stops changing.',
    whenToUse: 'Use for search inputs and expensive derived work.',
    category: 'State',
    api: useDebounceApi,
    Demo: UseDebounceDemo,
    example: useDebounceExample,
  },
  {
    id: 'useThrottle',
    name: 'useThrottle',
    summary: 'Limit how often a value updates.',
    whenToUse: 'Use for scroll, resize, and rapid input where you still want periodic updates.',
    category: 'State',
    tags: ['New'],
    api: useThrottleApi,
    Demo: UseThrottleDemo,
    example: useThrottleExample,
  },
  {
    id: 'useInterval',
    name: 'useInterval',
    summary: 'Declarative setInterval that always calls the latest callback.',
    whenToUse: 'Use for polling and timers. Pass null to pause.',
    category: 'State',
    api: useIntervalApi,
    Demo: UseIntervalDemo,
    example: useIntervalExample,
  },
  {
    id: 'useCopyToClipboard',
    name: 'useCopyToClipboard',
    summary: 'Copy text with the Clipboard API.',
    whenToUse: 'Use for share and copy buttons.',
    category: 'State',
    api: useCopyToClipboardApi,
    Demo: UseCopyToClipboardDemo,
    example: useCopyToClipboardExample,
  },
  {
    id: 'useLocalStorage',
    name: 'useLocalStorage',
    summary: 'Persist JSON-serializable state in localStorage.',
    whenToUse: 'Use for user preferences that should survive refresh.',
    category: 'State',
    api: useLocalStorageApi,
    Demo: UseLocalStorageDemo,
    example: useLocalStorageExample,
  },
  {
    id: 'useSessionStorage',
    name: 'useSessionStorage',
    summary: 'Persist JSON-serializable state in sessionStorage.',
    whenToUse: 'Use for drafts that should survive refresh but clear with the tab.',
    category: 'State',
    tags: ['New'],
    api: useSessionStorageApi,
    Demo: UseSessionStorageDemo,
    example: useSessionStorageExample,
  },
];
