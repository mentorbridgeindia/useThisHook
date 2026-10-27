export const browserDescriptions: Record<string, string> = {
  useOnlineStatus:
    'You want to warn “you are offline” or disable Save when the laptop loses the network. This hook is the browser’s online flag, updated when the browser fires online and offline. It is not a ping of your API.',
  useOnlineQueue:
    'The user queued a comment on the train. Hold items in memory while navigator.onLine is false, then drain FIFO when the browser fires online. If processItem throws, that item stays at the front.',
  useStorageQuota:
    'A PWA or editor writes large files and you need to warn before the origin quota is full. navigator.storage.estimate() after mount, with nulls when the API is missing.',
  useInstallPrompt:
    'Chromium fires beforeinstallprompt once. You must preventDefault to show your own Install button later. The hook holds that event, calls prompt(), and tracks standalone / appinstalled.',
  useCrossTabState:
    'Theme, a draft flag, or a dismissed banner should match in every tab. Write JSON to localStorage and notify others through BroadcastChannel and the storage event. SSR returns the initial value.',
  useKeyboardShortcut:
    'Command/Ctrl+K, Escape, or Shift+? should run a handler and unregister on unmount. Combos are plus-separated. Typing in inputs is ignored unless you turn that off.',
  useLongPress:
    'A card or list row should open a menu on press-and-hold, on mouse and touch. Moving past a pixel threshold or releasing early cancels. Spread the returned handlers onto the element.',
  useFingerprint:
    'You need a stable-enough visitor id in the browser without cookies or a backend — for abuse hints, anonymous personalization, or correlating sessions. The hook samples canvas, WebGL, screen, locale, and related signals, hashes them client-side, and exposes refresh(). No API key and no network call (unlike Fingerprint’s commercial Identification product).',
  useMediaQuery:
    'Layout should change at the same breakpoint as CSS, for example a compact toolbar under 768px. Match the query in JS without resize listeners and leftover subscriptions.',
  useWindowSize:
    'You need the actual pixel width or height: a canvas, a chart, a split pane. A media query is not enough. This hook tracks innerWidth and innerHeight on resize.',
  useOnClickOutside:
    'A popover or dropdown should close when the user presses outside it. Attach a ref to the surface and pass a close handler. Inside clicks stay ignored.',
  useOverlay:
    'You need a modal that the caller can await, like window.confirm but with your own UI. open(props) returns a promise; close(result) resolves it. Use it for delete confirms, pickers, and any dialog that must return a value before the flow continues.',
  useStepFlow:
    'Onboarding, checkout, or a three-screen import wizard. Each step is a component. next() starts the flow and resolves with every step’s data when the last step finishes, or null if the user cancels.',
  useAsyncSelect:
    'A button should open the native file picker and you want a Promise, not a hidden <input type="file"> in JSX. Call the function from a click, await the File (or File[]), and get null if they cancel.',
  useEventListener:
    'You need a resize, keydown, or custom event on window, document, or a node, without re-binding every render. Pass the target, type, and handler. The hook keeps the latest handler and cleans up on unmount.',
  useTimeout:
    'Run something once after a delay: a splash screen, a deferred toast. Pass null to cancel. Unlike useInterval, this fires once.',
  useKeyPress:
    'A shortcut such as Escape should flip a boolean while the key is held. Typing in inputs does not count.',
  useScrollLock:
    'A modal or drawer is open and the page behind should not scroll. Lock overflow on document.body, optionally pad for the scrollbar gutter, and unlock when the overlay closes.',
  useDocumentVisibility:
    'The tab is hidden and you should pause polling, video, or expensive work. This is document.visibilityState as a React value — visible or hidden.',
  useIdle:
    'You need a soft “away” or session-timeout signal. After a quiet period with no mouse, keyboard, touch, or scroll, the hook reports idle until the user moves again.',
};
