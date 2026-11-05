import { describe, it, expect } from 'vitest';
import { watString } from '../../../src/wasm/WabtString.js';

describe('watString Unicode scalar escapes', () => {
  it('decodes braced Unicode scalars as UTF-8, including supplementary characters', () => {
    const source = String.raw`"caf\u{e9} \u{1f600}"`;
    expect(() => watString(source, 1)).not.toThrow();
    const decoded = watString(source, 1);
    expect(decoded.bytes).toEqual(Buffer.from('café 😀', 'utf8'));
    expect(decoded.end).toBe(source.length);
  });

  it('rejects surrogate code points and values above the Unicode scalar range', () => {
    expect(() => watString(String.raw`"\u{d800}"`, 1)).toThrow();
    expect(() => watString(String.raw`"\u{110000}"`, 1)).toThrow();
  });
});
