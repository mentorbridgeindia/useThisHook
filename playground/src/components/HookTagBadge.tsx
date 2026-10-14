import type { HookTag } from '../hookDoc';

interface HookTagBadgeProps {
  tags?: HookTag[];
}

export const HookTagBadge = ({ tags }: HookTagBadgeProps) => {
  if (!tags?.includes('New')) return null;

  return (
    <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[0.65rem] font-sans font-medium uppercase tracking-[0.08em] text-emerald-800 dark:text-emerald-300/90">
      New
    </span>
  );
};
