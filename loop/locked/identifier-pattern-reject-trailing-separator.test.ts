import { describe, it, expect } from 'vitest';

import { IDENTIFIER_PATTERN } from '../../../src/domain/stringPatterns.js';

describe('IDENTIFIER_PATTERN separator placement', () => {
  it('rejects a dotted identifier whose separator is not followed by a character', () => {
    // The pattern is documented as a portable ASCII identifier, so a trailing
    // "." ends an empty segment and names no identifier.
    expect(IDENTIFIER_PATTERN.test('foo.')).toBe(false);
    expect(IDENTIFIER_PATTERN.test('a.b.')).toBe(false);
  });

  it('rejects empty segments and trailing hyphens while keeping ordinary dotted names', () => {
    expect(IDENTIFIER_PATTERN.test('a..b')).toBe(false);
    expect(IDENTIFIER_PATTERN.test('a-.b')).toBe(false);
    expect(IDENTIFIER_PATTERN.test('a.-b')).toBe(false);

    expect(IDENTIFIER_PATTERN.test('a')).toBe(true);
    expect(IDENTIFIER_PATTERN.test('a.b-c.d1')).toBe(true);
  });
});