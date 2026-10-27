import { afterEach, describe, expect, it } from 'vitest';
import { defaultDevEnabled } from './devEnabled';

describe('defaultDevEnabled', () => {
  const original = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = original;
  });

  it('is enabled outside production', () => {
    process.env.NODE_ENV = 'test';
    expect(defaultDevEnabled()).toBe(true);
  });

  it('is disabled in production', () => {
    process.env.NODE_ENV = 'production';
    expect(defaultDevEnabled()).toBe(false);
  });
});
