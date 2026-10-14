import { useState } from 'react';
import { useThrottledCallback } from 'usethishook';
import { inputClass } from '../components/styles';

export const UseThrottledCallbackDemo = () => {
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [runSearch] = useThrottledCallback((value: string) => {
    setLogs((previous) => [`Fetched “${value}”`, ...previous].slice(0, 4));
  }, 400);

  return (
    <div className="space-y-3">
      <input
        className={inputClass}
        value={query}
        placeholder="Type; fetch at most every 400ms"
        onChange={(event) => {
          setQuery(event.target.value);
          runSearch(event.target.value);
        }}
      />
      <ul className="space-y-1 text-sm text-muted">
        {logs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export const useThrottledCallbackExample = `import { useThrottledCallback } from 'usethishook';

export const Search = () => {
  const [search] = useThrottledCallback((q: string) => api.search(q), 300);
  return <input onChange={(event) => search(event.target.value)} />;
};`;
