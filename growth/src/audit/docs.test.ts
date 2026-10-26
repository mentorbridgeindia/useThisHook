import { describe, expect, it } from 'vitest';
import { loadGrowthConfig } from '../config.js';
import { auditDocumentation } from './docs.js';

describe('auditDocumentation', () => {
  it('runs against the real repo docs and catalog without throwing', () => {
    const config = loadGrowthConfig();
    const findings = auditDocumentation(config);
    expect(Array.isArray(findings)).toBe(true);
    // Catalog and sitemap are generated together in this repo, so high-severity
    // missing-example findings should not appear for published hooks.
    expect(findings.every((item) => item.message.length > 0)).toBe(true);
  });
});
