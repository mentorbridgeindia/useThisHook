import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { formatHookMarkdown, getHook, listHooks, loadCatalog } from './catalog.js';
import { recommendHooks, searchHooks } from './search.js';
import type { HookCategory, HookDoc } from './types.js';

const categories = ['State', 'Browser', 'App'] as const;

function textResult(text: string) {
  return {
    content: [{ type: 'text' as const, text }],
  };
}

function jsonResult(value: unknown) {
  return textResult(JSON.stringify(value, null, 2));
}

function toListItem(hook: HookDoc) {
  return {
    id: hook.id,
    name: hook.name,
    summary: hook.summary,
    category: hook.category,
    whenToUse: hook.whenToUse,
    playgroundUrl: hook.playgroundUrl,
  };
}

export function createUseThisHookServer(): McpServer {
  const server = new McpServer({
    name: 'usethishook',
    version: '1.1.0',
  });

  server.registerTool(
    'list_hooks',
    {
      title: 'List hooks',
      description:
        'List all useThisHook React hooks. Optionally filter by category: State, Browser, or App.',
      inputSchema: {
        category: z
          .enum(categories)
          .optional()
          .describe('Optional category filter: State | Browser | App'),
      },
    },
    ({ category }) => {
      const hooks = listHooks(category as HookCategory | undefined);
      return jsonResult({ count: hooks.length, hooks });
    },
  );

  server.registerTool(
    'search_hooks',
    {
      title: 'Search hooks',
      description:
        'Search useThisHook by keyword or phrase (name, summary, when-to-use, description, API).',
      inputSchema: {
        query: z.string().min(1).describe('Search text, e.g. "debounce search input"'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(33)
          .optional()
          .describe('Max results to return (default 8)'),
      },
    },
    ({ query, limit }) => {
      const hooks = searchHooks(query, limit ?? 8).map(toListItem);
      return jsonResult({ query, count: hooks.length, hooks });
    },
  );

  server.registerTool(
    'get_hook',
    {
      title: 'Get hook docs',
      description:
        'Get full documentation for one useThisHook hook: description, API, example, and playground URL.',
      inputSchema: {
        name: z.string().min(1).describe('Hook id or name, e.g. useBoolean or useConfirm'),
      },
    },
    ({ name }) => {
      const hook = getHook(name);
      if (!hook) {
        const available = listHooks()
          .map((item) => item.id)
          .join(', ');
        return textResult(
          `Unknown hook "${name}". Available hooks: ${available}. Use search_hooks or list_hooks to discover hooks.`,
        );
      }
      return textResult(formatHookMarkdown(hook));
    },
  );

  server.registerTool(
    'recommend_hook',
    {
      title: 'Recommend a hook',
      description:
        'Given a React UI task or problem, recommend the best useThisHook hooks with short reasons.',
      inputSchema: {
        task: z
          .string()
          .min(1)
          .describe('What you are building, e.g. "await yes/no before deleting a row"'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(10)
          .optional()
          .describe('Max recommendations (default 5)'),
      },
    },
    ({ task, limit }) => {
      const hooks = recommendHooks(task, limit ?? 5);
      if (hooks.length === 0) {
        return textResult(
          `No strong matches for "${task}". Try list_hooks or a broader search_hooks query.`,
        );
      }
      const lines = [
        `Recommendations for: ${task}`,
        '',
        ...hooks.map((hook, index) => {
          return [
            `${index + 1}. **${hook.name}** (${hook.category}${hook.tags?.length ? ` · ${hook.tags.join(', ')}` : ''})`,
            `   ${hook.summary}`,
            `   When: ${hook.whenToUse}`,
            `   Docs tool: get_hook name="${hook.id}"`,
            `   Playground: ${hook.playgroundUrl}`,
          ].join('\n');
        }),
      ];
      return textResult(lines.join('\n'));
    },
  );

  server.registerResource(
    'hooks-index',
    'usethishook://hooks',
    {
      title: 'useThisHook catalog',
      description: 'Index of every hook in useThisHook with summary and category.',
      mimeType: 'application/json',
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ hooks: listHooks() }, null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    'hook-docs',
    new ResourceTemplate('usethishook://hooks/{id}', {
      list: () => ({
        resources: loadCatalog().map((hook) => ({
          uri: `usethishook://hooks/${hook.id}`,
          name: hook.name,
          title: hook.name,
          description: hook.summary,
          mimeType: 'text/markdown',
        })),
      }),
    }),
    {
      title: 'Hook documentation',
      description: 'Markdown docs for a single useThisHook hook.',
      mimeType: 'text/markdown',
    },
    (uri, variables) => {
      const id = String(variables.id ?? '');
      const hook = getHook(id);
      if (!hook) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'text/plain',
              text: `Unknown hook: ${id}`,
            },
          ],
        };
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'text/markdown',
            text: formatHookMarkdown(hook),
          },
        ],
      };
    },
  );

  server.registerPrompt(
    'pick_hook',
    {
      title: 'Pick a useThisHook',
      description: 'Ask the model to choose the right useThisHook for a React task.',
      argsSchema: {
        task: z.string().describe('The UI or state problem to solve'),
      },
    },
    ({ task }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'You are helping a React developer pick a hook from the useThisHook library (npm: usethishook).',
              'Use the usethishook MCP tools (search_hooks, recommend_hook, get_hook) before answering.',
              'Prefer a single best hook, mention alternatives only when useful, and include a minimal import + usage snippet.',
              '',
              `Task: ${task}`,
            ].join('\n'),
          },
        },
      ],
    }),
  );

  return server;
}
