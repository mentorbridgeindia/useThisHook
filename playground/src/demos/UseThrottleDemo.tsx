import { useState } from 'react';
import { useThrottle } from 'usethishook';
import { inputClass } from '../components/styles';

export const UseThrottleDemo = () => {
  const [query, setQuery] = useState('');
  const throttledQuery = useThrottle(query, 400);

  return (
    <div className="space-y-3">
      <input
        className={inputClass}
        value={query}
        placeholder="Type quickly"
        onChange={(event) => setQuery(event.target.value)}
      />
      <p>Immediate: {query || '—'}</p>
      <p>Throttled: {throttledQuery || '—'}</p>
    </div>
  );
};

export const useThrottleExample = `import { useState } from 'react';
import { useThrottle } from 'usethishook';

export const Search = () => {
  const [query, setQuery] = useState('');
  const throttledQuery = useThrottle(query, 300);
  return <input value={query} onChange={(event) => setQuery(event.target.value)} />;
};`;
