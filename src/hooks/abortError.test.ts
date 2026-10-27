import { describe, expect, it } from 'vitest';
import { abortError } from './abortError';

describe('abortError', () => {
  it('creates an AbortError', () => {
    const error = abortError();
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AbortError');
    expect(error.message).toBe('Aborted');
  });
});
