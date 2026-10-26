import { describe, expect, it } from 'vitest';
import { redactSecrets } from './redact.js';

describe('redactSecrets', () => {
  it('redacts bearer tokens and explicit secrets', () => {
    const input = 'Authorization: Bearer abcdefghijklmnop api_key="supersecretvalue"';
    const output = redactSecrets(input, ['supersecretvalue']);
    expect(output).not.toContain('abcdefghijklmnop');
    expect(output).not.toContain('supersecretvalue');
    expect(output).toContain('[REDACTED]');
  });
});
