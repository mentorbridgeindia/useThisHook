export const appDescriptions: Record<string, string> = {
  useStableCallback:
    'You pass a callback into an interval, a subscription, or a child that memoizes on function identity. If you put the function in the dependency array, the subscription resets; if you omit it, you capture stale state. useStableCallback is one function identity that always calls the latest code.',
  useResetState:
    'You edit a draft for user A, then the route changes to user B. Local state still shows A’s name because you synced with useEffect and missed a dependency. useResetState takes a source key (the user id). When the key changes, state is the new initial value. Same idea as key={userId} on a form, as a hook.',
  useAsyncAction:
    'A Save, Send, or “Generate report” button. You need pending, error, and the last result, and you must ignore a response if the user fired the action again. This is not a query cache. It is the mutation UI around one async function.',
  useDebouncedCallback:
    'You want to debounce work, not a displayed value: search fetch, persist on type, resize handler. useDebounce lags a value for rendering. useDebouncedCallback lags calling a function and can cancel the pending call.',
  useAmountInput:
    'A price, invoice, or quantity field that must look local while you type: French spaces, Dutch dots, English commas, and a cursor that does not jump when grouping appears. The input shows the formatted string; submit still gets a canonical "12345.67". Pass language, decimalCount, and the returned ref.',
  useFields:
    'A modal or settings card with five fields. You do not want React Hook Form for that, and you do not want useState per input. One object, setField, dirty flag, optional schema (Zod-shaped safeParse), and submit(onValid).',
  useList:
    'A list the user can add to, rename, delete, and reorder: todos, attendees, stages. Instead of spreading arrays in every handler, you get insert, update, remove, and move on items that have an id.',
  useSelection:
    'A table or checklist: click to select, cmd-click to multi-select, “select all on this page,” clear. You should not keep a Set in three places. useSelection is the selected ids and those operations, single or multiple.',
  useSearchState:
    'Filters, tabs, and page number should live in the URL so refresh and share work. People sync useState to search params with useEffect and fight loops. This hook is the query string as state: read it, set it, the address bar updates.',
  useConfirm:
    'You need “Are you sure?” before delete, and you want to await the answer in the click handler. Same idea as useOverlay, with a default dialog. Call confirm({ title, danger }), put render() in the tree, branch on true/false.',
  usePrompt:
    'You need a single string from the user — rename, “name this view” — without standing up a form page. await prompt({ title, label }) returns the string or null if they cancel. Render the dialog with render().',
  useControllableState:
    'You are building a Switch, Tabs, or Drawer that must work in two ways: the parent owns the value, or the component owns it. Teams copy this if (value !== undefined) branch into every primitive. useControllableState is that branch: pass value to control it, omit value to stay uncontrolled, onChange always fires.',
  useUnsavedChanges:
    'The user edited a form and hits Back, a sidebar link, or closes the tab. You need a beforeunload warning for the tab, and an awaitable confirm for in-app navigation. Wire isDirty from useFields or your form library, inject useConfirm if you want your own dialog, and call confirmLeave() before changing the route.',
  useElementSize:
    'A chart, canvas, or virtual list must match the box it lives in — not the window. useWindowSize re-renders on every viewport resize and still does not know the column width. Attach the callback ref; width and height track that node through ResizeObserver.',
  useInView:
    'You want to load a heavy widget, fetch the next page, or start an animation only when the user can see the element. IntersectionObserver is the right API; the hook is the ref plus isInView. Set once if you only care about the first time it appears.',
  usePagination:
    'A table or gallery has 200 rows and you show 20 at a time. You need page, how many pages, the slice offset, and disabled next/prev. When a filter shrinks the list, the current page must clamp instead of pointing at empty space. usePagination is that math.',
};
