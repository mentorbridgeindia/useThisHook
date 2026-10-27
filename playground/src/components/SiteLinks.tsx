interface SiteLinksProps {
  className?: string;
}

export const SiteLinks = ({ className = '' }: SiteLinksProps) => (
  <p className={`flex flex-wrap gap-x-3 gap-y-1 text-sm ${className}`.trim()}>
    <a
      className="text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300"
      href="https://www.npmjs.com/package/usethishook"
      rel="noreferrer"
      target="_blank"
    >
      npm
    </a>
    <a
      className="text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300"
      href="https://github.com/senthilkumar979/useThisHook"
      rel="noreferrer"
      target="_blank"
    >
      GitHub
    </a>
    <a
      className="text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300"
      href="https://github.com/senthilkumar979/useThisHook/wiki"
      rel="noreferrer"
      target="_blank"
    >
      Wiki
    </a>
    <a
      className="text-violet-700 underline decoration-violet-400/50 underline-offset-2 hover:decoration-violet-500 dark:text-violet-300"
      href="https://www.npmjs.com/package/usethishook-mcp"
      rel="noreferrer"
      target="_blank"
    >
      MCP
    </a>
  </p>
);
