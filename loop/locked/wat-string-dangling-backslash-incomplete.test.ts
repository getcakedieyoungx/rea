import { describe, it, expect } from 'vitest';
import { watString } from '../../../src/wasm/WabtString.js';

describe('watString unterminated trailing backslash', () => {
  it('reports an incomplete name when the string ends on a dangling backslash', () => {
    // The opening quote is never closed: the final backslash has no escape
    // character after it and no closing quote follows. The scanner's double
    // increment past the backslash pushes `end` past form.length, so the
    // `end === form.length` incompleteness guard never fires and decoding
    // misreports the truncated input as a bad escape.
    const form = '"can\\';
    expect(() => watString(form, 1)).toThrow(
      'Incomplete WABT custom-section name.',
    );
  });

  it('still accepts a string whose last escaped character is a backslash', () => {
    const form = '"can\\\\"';
    const decoded = watString(form, 1);
    expect(decoded.bytes.toString('utf8')).toBe('can\\');
    expect(decoded.end).toBe(form.length);
  });
});
