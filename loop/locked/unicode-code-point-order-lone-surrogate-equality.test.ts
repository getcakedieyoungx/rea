import { describe, it, expect } from 'vitest';
import { compareUnicodeCodePoints } from '../../../src/domain/unicodeCodePointOrder.js';

describe('compareUnicodeCodePoints advances past a lone surrogate by one code unit', () => {
  it('does not report two different strings as equal when a lone high surrogate precedes the difference', () => {
    // "\uD800B" and "\uD800C" both start with a lone high surrogate; the code
    // after it is the only difference. Current code skips index 1 because a
    // lone surrogate's codePointAt value exceeds 0xffff, so it returns 0.
    const left = '\uD800B';
    const right = '\uD800C';

    expect(left).not.toBe(right);
    expect(compareUnicodeCodePoints(left, right)).toBeLessThan(0);
    expect(compareUnicodeCodePoints(right, left)).toBeGreaterThan(0);
    expect(compareUnicodeCodePoints(left, right)).toBe(
      -compareUnicodeCodePoints(right, left),
    );
  });

  it('still orders astral pairs and ordinary text by code point', () => {
    expect(compareUnicodeCodePoints('a', 'b')).toBeLessThan(0);
    expect(compareUnicodeCodePoints('\u{1F600}', '\uFFFF')).toBeGreaterThan(0);
    expect(compareUnicodeCodePoints('\u{1F600}', '\u{1F600}')).toBe(0);
    expect(compareUnicodeCodePoints('ab', 'a')).toBeGreaterThan(0);
  });
});