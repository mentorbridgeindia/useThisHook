import { useCrossTabState } from 'usethishook';
import { buttonClass, inputClass } from '../components/styles';

export const UseCrossTabStateDemo = () => {
  const [title, setTitle] = useCrossTabState('uth-demo-title', 'Hello');

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Open this page in another tab and type. Both should stay in sync.
      </p>
      <input
        className={inputClass}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="button" className={buttonClass} onClick={() => setTitle('Hello')}>
        Reset
      </button>
    </div>
  );
};

export const useCrossTabStateExample = `import { useCrossTabState } from 'usethishook';

export const ThemeSync = () => {
  const [theme, setTheme] = useCrossTabState<'light' | 'dark'>('theme', 'light');
  return (
    <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme}
    </button>
  );
};`;
