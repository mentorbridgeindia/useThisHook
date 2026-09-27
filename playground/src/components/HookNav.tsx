import { hooksCatalog } from '../hooksCatalog';
import { hookPageHref } from '../hookHref';
import { NavGroupHeader } from './NavGroupHeader';

interface HookNavProps {
  activeId?: string;
}

export const HookNav = ({ activeId }: HookNavProps) => {
  const groups = ['State', 'Browser', 'App'] as const;

  const isHome = !activeId;

  return (
    <nav className="flex flex-col gap-5 pr-1">
      <a
        href="#/"
        aria-current={isHome ? 'page' : undefined}
        className={`rounded-lg px-2.5 py-1.5 text-sm font-medium ${
          isHome
            ? 'bg-violet-500/15 text-fg shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]'
            : 'text-muted hover:bg-code hover:text-fg'
        }`}
      >
        Home
      </a>
      {groups.map((group) => {
        const hooks = hooksCatalog.filter((hook) => hook.category === group);
        return (
          <div key={group}>
            <NavGroupHeader category={group} count={hooks.length} />
            <div className="flex flex-col gap-0.5">
              {hooks.map((hook) => {
                const isActive = hook.id === activeId;
                return (
                  <a
                    key={hook.id}
                    href={hookPageHref(hook.id)}
                    className={`rounded-lg px-2.5 py-1.5 font-mono text-[0.8rem] ${
                      isActive
                        ? 'bg-violet-500/15 text-fg shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]'
                        : 'text-muted hover:bg-code hover:text-fg'
                    }`}
                  >
                    {hook.name}
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
};
