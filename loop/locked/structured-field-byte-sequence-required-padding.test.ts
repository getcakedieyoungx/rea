import { describe, it, expect } from 'vitest';

import { structuredFieldToken } from '../../../src/browser/StructuredFieldToken.js';

describe('Structured Field byte sequence padding', () => {
  it('rejects a byte sequence whose base64 content omits required padding', () => {
    // "aGVsbG8" is 7 characters: RFC 4648 base64 requires padding ("aGVsbG8=").
    // Current code only rejects length % 4 === 1, so this returns 'next'.
    expect(structuredFieldToken('next;binary=:aGVsbG8:')).toBeNull();
    // Same gap for the 2-character remainder: "aGVsbG8gd29ybGQ" needs "=".
    expect(structuredFieldToken('next;binary=:aGVsbG8gd29ybGQ:')).toBeNull();
  });

  it('keeps accepting correctly padded byte sequences', () => {
    expect(structuredFieldToken('next;binary=:aGVsbG8=:')).toBe('next');
    expect(structuredFieldToken('next;binary=::')).toBe('next');
    expect(structuredFieldToken('next;binary=:YWJjZA==:')).toBe('next');
  });
});