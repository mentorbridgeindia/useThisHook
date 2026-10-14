import { useScrollLock } from 'usethishook';
import { buttonClass, ghostButtonClass } from '../components/styles';

export const UseScrollLockDemo = () => {
  const { isLocked, lock, unlock } = useScrollLock({ autoLock: false });

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Body scroll is {isLocked ? 'locked' : 'unlocked'}. Locking sets overflow:hidden on
        document.body (useful under modals).
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={lock}>
          Lock scroll
        </button>
        <button type="button" className={ghostButtonClass} onClick={unlock}>
          Unlock
        </button>
      </div>
      <div className="h-40 overflow-auto rounded-xl border border-line bg-code p-3 text-sm text-muted">
        <p className="mb-2">
          Scroll this box while body lock is on — the page behind should not move.
        </p>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index}>Line {index + 1}</p>
        ))}
      </div>
    </div>
  );
};

export const useScrollLockExample = `import { useScrollLock } from 'usethishook';

export const Modal = ({ open }: { open: boolean }) => {
  useScrollLock({ autoLock: open });
  if (!open) return null;
  return <div role="dialog">…</div>;
};`;
