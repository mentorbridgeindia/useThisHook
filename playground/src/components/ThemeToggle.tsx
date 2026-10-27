import { gooeyToast } from 'goey-toast';
import { useState } from 'react';
import { applyTheme, readTheme, type Theme } from '../theme';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document === 'undefined' ? 'light' : readTheme(),
  );

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
    if (next === 'dark') gooeyToast.info('You chose chaos. The moths are already on their way.');
    else gooeyToast.success('Look at you, flipping the sun back on like you own the sky.');
  };

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      className="fixed top-4 right-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg shadow-sm hover:bg-code"
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 14.3A8.5 8.5 0 0 1 9.7 3 7 7 0 1 0 21 14.3Z"
    />
  </svg>
);

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path
      strokeLinecap="round"
      d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06"
    />
  </svg>
);
