import { describe, it, expect } from 'vitest';
import {
  CANONICAL_BASE64_PATTERN,
  IDENTIFIER_PATTERN,
  STABLE_IDENTIFIER_PATTERN,
} from '../../../src/domain/stringPatterns.js';

describe('portable value patterns end at the string, not before a line terminator', () => {
  it('rejects a value whose final character is a line terminator', () => {
    // `$` without the `m` flag still matches immediately before one final
    // "\n", so every pattern below admits a value that ends with a newline.
    // Fails today: all three assertions currently receive true.
    expect(IDENTIFIER_PATTERN.test('plugin\n')).toBe(false);
    expect(STABLE_IDENTIFIER_PATTERN.test('src/main.ts\n')).toBe(false);
    expect(CANONICAL_BASE64_PATTERN.test('AAAA\n')).toBe(false);
  });

  it('keeps admitting the same values without the trailing newline', () => {
    expect(IDENTIFIER_PATTERN.test('plugin')).toBe(true);
    expect(STABLE_IDENTIFIER_PATTERN.test('a.b_c-d')).toBe(true);
    expect(STABLE_IDENTIFIER_PATTERN.test('src/main.ts')).toBe(true);
    expect(CANONICAL_BASE64_PATTERN.test('AAAA')).toBe(true);
    expect(CANONICAL_BASE64_PATTERN.test('')).toBe(true);
  });
});