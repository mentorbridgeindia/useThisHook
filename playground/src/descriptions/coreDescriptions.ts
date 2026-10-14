export const coreDescriptions: Record<string, string> = {
  useBoolean:
    'You have a panel, switch, or “show more” control. Pass true or false as the starting value. You get named helpers to turn it on, turn it off, or flip it — without a raw boolean plus setState(!value) in three places.',
  useDisclosure:
    'A menu, drawer, or dialog is either visible or not. Buttons need Open, Close, and sometimes Toggle. useDisclosure is that lifecycle so you are not mixing a boolean named isOpen with ad-hoc setters.',
  useDebounce:
    'The user is typing into search or a filter. You do not want to hit the server or filter a huge list on every keystroke. Debounce the value, then use the lagged copy for the expensive work. The input itself stays instant.',
  useInterval:
    'You need a ticking clock, a poll, or a progress bar that advances on a schedule. You are tired of setInterval inside useEffect, stale closures, and forgetting clearInterval. Pass null to pause without tearing the component down.',
  useCopyToClipboard:
    'A “Copy invite link” or “Copy code” button. You need to write to the clipboard and show Copied for a moment. This hook is that interaction, including failure when the browser blocks clipboard access.',
  useLocalStorage:
    'A preference should survive refresh: theme, sidebar width, last used project. You want useState that writes JSON to localStorage. This is that pair of value and setter, with a fallback if storage is empty or corrupt.',
  useSessionStorage:
    'A draft or wizard step should survive refresh but not outlive the tab. Same shape as useLocalStorage, backed by sessionStorage instead.',
  useThrottle:
    'A value changes often — scroll position, pointer coords, or rapid typing — and you need updates at a steady cadence rather than waiting for silence. Throttle keeps the first update in a window and a trailing latest value.',
};
