import { CodeBlock } from '../components/CodeBlock';

const cursorConfig = `{
  "mcpServers": {
    "usethishook": {
      "command": "npx",
      "args": ["-y", "usethishook-mcp"]
    }
  }
}`;

export const McpPage = () => (
  <article className="mx-auto max-w-4xl space-y-8">
    <header className="space-y-3">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300/80">
        AI coding tools
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">usethishook-mcp</h1>
      <p className="max-w-2xl text-lg leading-8 text-muted">
        An MCP server so Cursor, Claude Desktop, and other hosts can list, search, and paste the
        real API for all 53 hooks instead of inventing one.
      </p>
    </header>
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
        Cursor / Claude Desktop
      </h2>
      <CodeBlock label="MCP config" code={cursorConfig} />
    </section>
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Tools</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
        <li>
          <span className="font-mono text-fg">list_hooks</span> — optional category filter
        </li>
        <li>
          <span className="font-mono text-fg">search_hooks</span> — name, summary, docs, API text
        </li>
        <li>
          <span className="font-mono text-fg">get_hook</span> — markdown docs plus copy-paste
          example
        </li>
        <li>
          <span className="font-mono text-fg">recommend_hook</span> — best hooks for a task
        </li>
      </ul>
    </section>
    <p className="text-sm leading-6 text-muted">
      Package:{' '}
      <a
        className="font-medium text-violet-700 underline decoration-violet-400/50"
        href="https://www.npmjs.com/package/usethishook-mcp"
        rel="noreferrer"
        target="_blank"
      >
        usethishook-mcp
      </a>
      . Repo docs:{' '}
      <a
        className="font-medium text-violet-700 underline decoration-violet-400/50"
        href="https://github.com/senthilkumar979/useThisHook/blob/main/mcp/README.md"
        rel="noreferrer"
        target="_blank"
      >
        mcp/README.md
      </a>
      .
    </p>
  </article>
);
