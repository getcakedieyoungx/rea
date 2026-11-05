import { describe, it, expect } from 'vitest';

import { parsePlistIntegerLiteral } from '../../../src/domain/apple/plistNumbers.js';

describe('plist integer literal exact text', () => {
  it('rejects surrounding whitespace instead of trimming the argument', () => {
    // The decoder hands over the element character content verbatim; trimming
    // silently turns " 42 " into a valid integer the source never spelled.
    expect(parsePlistIntegerLiteral(' 42')).toBeUndefined();
    expect(parsePlistIntegerLiteral('42 ')).toBeUndefined();
    expect(parsePlistIntegerLiteral('\t0x2a\n')).toBeUndefined();
    expect(parsePlistIntegerLiteral('\u00a042')).toBeUndefined();
  });

  it('still decodes exact decimal and signed hexadecimal literals', () => {
    expect(parsePlistIntegerLiteral('42')).toBe(42n);
    expect(parsePlistIntegerLiteral('-42')).toBe(-42n);
    expect(parsePlistIntegerLiteral('0x2a')).toBe(42n);
    expect(parsePlistIntegerLiteral('-0xFF')).toBe(-255n);
  });
});