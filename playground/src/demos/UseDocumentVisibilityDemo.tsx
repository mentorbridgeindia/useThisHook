import { useDocumentVisibility } from 'usethishook';

export const UseDocumentVisibilityDemo = () => {
  const visibility = useDocumentVisibility();

  return (
    <div className="space-y-3">
      <p>
        Document is <strong>{visibility}</strong>.
      </p>
      <p className="text-sm text-muted">
        Switch to another tab and back — the value updates via the Page Visibility API.
      </p>
    </div>
  );
};

export const useDocumentVisibilityExample = `import { useEffect } from 'react';
import { useDocumentVisibility } from 'usethishook';

export const Poller = () => {
  const visibility = useDocumentVisibility();

  useEffect(() => {
    if (visibility === 'hidden') return;
    const id = window.setInterval(() => api.refresh(), 10_000);
    return () => window.clearInterval(id);
  }, [visibility]);

  return null;
};`;
