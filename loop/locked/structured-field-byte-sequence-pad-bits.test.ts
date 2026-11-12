import { describe, it, expect } from 'vitest';

import { structuredFieldToken } from '../../../src/browser/StructuredFieldToken.js';

describe('structuredFieldToken Byte Sequence pad bits', () => {
  it('rejects a byte sequence with non-zero pad bits', () => {
    // RFC 9651 section 4.2.7: a decoder must fail on non-zero pad bits.
    // "AB==" decodes to 0x00 with four non-zero pad bits, so the whole
    // Structured Field Item is invalid and no token may be declared.
    expect(structuredFieldToken('text/html;x=:AB==:')).toBeNull();
    expect(structuredFieldToken('text/html;x=:AAA=:')).toBeNull();
  });

  it('still accepts a byte sequence whose pad bits are zero', () => {
    expect(structuredFieldToken('text/html;x=:YQ==:')).toBe('text/html');
    expect(structuredFieldToken('text/html;x=:YWJj:')).toBe('text/html');
  });
});