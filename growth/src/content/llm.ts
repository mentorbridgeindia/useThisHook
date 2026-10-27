import type { HttpClient } from '../http.js';
import { safeWarn } from '../redact.js';
import type { ContentDraft, EnvConfig, GrowthConfig, HookCatalogEntry } from '../types.js';
import { buildDeterministicDraft } from './deterministic.js';
import { validateContentDraft } from './validate.js';

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

export async function generateContentDraft(
  http: HttpClient,
  hook: HookCatalogEntry,
  hooks: HookCatalogEntry[],
  config: GrowthConfig,
  env: EnvConfig,
): Promise<ContentDraft> {
  const fallback = buildDeterministicDraft(hook, config);
  if (!env.llmApiKey || !env.llmBaseUrl || !env.llmModel) return fallback;

  try {
    const base = env.llmBaseUrl.replace(/\/$/, '');
    const response = await http.post(`${base}/chat/completions`, {
      headers: {
        Authorization: `Bearer ${env.llmApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.llmModel,
        temperature: 0.2,
        max_tokens: config.limits.llmMaxOutputTokens,
        messages: [
          {
            role: 'system',
            content:
              'You write factual React tutorial drafts. Use only provided hook facts. Return strict JSON.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              instruction:
                'Create one tutorial draft. Do not invent hooks, APIs, or benchmarks. Keep drafts for human review.',
              hook,
              installCommand: config.content.installCommand,
              schema: {
                title: 'string',
                outline: 'string[]',
                linkedInDraft: 'string',
                communityDraft: 'string',
              },
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      safeWarn(`LLM request failed with status ${response.status}`, [env.llmApiKey]);
      return fallback;
    }

    const body = response.json<ChatCompletionResponse>();
    const content = body.choices?.[0]?.message?.content;
    if (!content) return fallback;

    const parsed = parseJsonObject(content);
    if (!parsed) return fallback;

    const draft: ContentDraft = {
      ...fallback,
      title: asText(parsed.title, fallback.title),
      outline: Array.isArray(parsed.outline) ? parsed.outline.map(String) : fallback.outline,
      linkedInDraft: asText(parsed.linkedInDraft, fallback.linkedInDraft),
      communityDraft: asText(parsed.communityDraft, fallback.communityDraft),
      source: 'llm',
      caveats: [...fallback.caveats, 'LLM output accepted only after catalog validation.'],
    };

    const validation = validateContentDraft(draft, hooks);
    if (!validation.ok) {
      safeWarn(`LLM draft rejected: ${validation.reasons.join('; ')}`, [env.llmApiKey]);
      return fallback;
    }
    return draft;
  } catch (error) {
    safeWarn(
      `LLM generation fell back to deterministic draft: ${error instanceof Error ? error.message : String(error)}`,
      [env.llmApiKey],
    );
    return fallback;
  }
}

function asText(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function jsonPayload(content: string): string {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start === -1 || end <= start) return content.trim();
  return content.slice(start, end + 1);
}

function parseJsonObject(content: string): Record<string, unknown> | null {
  const raw = jsonPayload(content);
  try {
    const value = JSON.parse(raw) as unknown;
    if (value && typeof value === 'object' && !Array.isArray(value))
      return value as Record<string, unknown>;
  } catch {
    return null;
  }
  return null;
}
