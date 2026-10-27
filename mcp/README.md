# usethishook-mcp

MCP (Model Context Protocol) server for **[useThisHook](https://usethishook.mentorbridge.in/)** **1.3.0** (53 hooks).

Playground setup page: [usethishook.mentorbridge.in/mcp](https://usethishook.mentorbridge.in/mcp).

AI clients (Cursor, Claude Desktop, and other MCP hosts) can list, search, and fetch typed docs/examples for every hook in the library.

## Tools

| Tool             | Purpose                                                 |
| ---------------- | ------------------------------------------------------- |
| `list_hooks`     | List hooks (optional `category`: State / Browser / App) |
| `search_hooks`   | Keyword search across name, summary, docs, and API text |
| `get_hook`       | Full markdown docs + copy-paste example for one hook    |
| `recommend_hook` | Best hooks for a natural-language React task            |

## Resources

| URI                        | Content                    |
| -------------------------- | -------------------------- |
| `usethishook://hooks`      | JSON index of every hook   |
| `usethishook://hooks/{id}` | Markdown docs for one hook |

## Prompt

- `pick_hook` — guided prompt that tells the model to use these tools before choosing a hook.

## Cursor setup

Add to your MCP config (Cursor Settings → MCP, or `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "usethishook": {
      "command": "npx",
      "args": ["-y", "usethishook-mcp"]
    }
  }
}
```

From this monorepo (after `npm run mcp:build`):

```json
{
  "mcpServers": {
    "usethishook": {
      "command": "node",
      "args": ["mcp/dist/index.js"]
    }
  }
}
```

## Develop in this repo

From the repository root:

```bash
npm run mcp:catalog   # refresh data/catalog.json from playground docs
npm run mcp:build
npm run mcp:test
```

Or inside `mcp/`:

```bash
npm install
npm test
npm run build
npm start             # stdio MCP server (for Inspector / hosts)
```

Try with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node mcp/dist/index.js
```

## Keeping the catalog fresh

`data/catalog.json` is generated from the playground (`api/`, `descriptions/`, `*Hooks.ts`, demos).

Whenever you add or change a hook’s playground docs, run:

```bash
npm run mcp:catalog
```

CI runs `mcp:catalog` and fails if the committed JSON is stale.
