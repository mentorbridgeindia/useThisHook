import { useState } from 'react';
import { useKeyboardShortcut } from 'usethishook';

export const UseKeyboardShortcutDemo = () => {
  const [hits, setHits] = useState(0);
  useKeyboardShortcut('ctrl+k', () => setHits((value) => value + 1));

  return (
    <div className="space-y-3">
      <p>
        Press <kbd className="rounded border border-line px-1.5 py-0.5 text-sm">Ctrl</kbd>
        <span> + </span>
        <kbd className="rounded border border-line px-1.5 py-0.5 text-sm">K</kbd> (ignored while
        typing in fields). Hits: <strong>{hits}</strong>
      </p>
      <input
        className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm"
        placeholder="Type here — shortcut should not fire"
      />
    </div>
  );
};

export const useKeyboardShortcutExample = `import { useKeyboardShortcut } from 'usethishook';

export const CommandPalette = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  useKeyboardShortcut('mod+k', () => setOpen(!open));
  return open ? <div>Palette</div> : null;
};`;
