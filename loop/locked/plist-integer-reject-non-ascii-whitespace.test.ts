import { describe, it, expect } from 'vitest';
import { parsePlistIntegerLiteral } from '../../../src/domain/apple/plistNumbers.js';

describe('plist integer literal whitespace', () => {
  it('rejects non-breaking spaces rather than silently stripping them', () => {
    expect(parsePlistIntegerLiteral('\u00a042\u00a0')).toBeUndefined();
  });

  it('continues to accept surrounding XML whitespace', () => {
    expect(parsePlistIntegerLiteral(' \t\r\n42\t ')).toBe(42n);
  });
});
