import { useSessionStorage } from 'usethishook';
import { inputClass } from '../components/styles';

export const UseSessionStorageDemo = () => {
  const [draft, setDraft] = useSessionStorage('playground-draft', '');

  return (
    <div className="space-y-3">
      <input
        className={inputClass}
        value={draft}
        placeholder="Session draft"
        onChange={(event) => setDraft(event.target.value)}
      />
      <p>
        Stored as playground-draft in sessionStorage. Survives refresh, clears when the tab closes.
      </p>
    </div>
  );
};

export const useSessionStorageExample = `import { useSessionStorage } from 'usethishook';

export const DraftField = () => {
  const [draft, setDraft] = useSessionStorage('draft', '');
  return <input value={draft} onChange={(event) => setDraft(event.target.value)} />;
};`;
