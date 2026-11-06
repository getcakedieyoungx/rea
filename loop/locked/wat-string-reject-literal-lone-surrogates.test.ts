import { describe, it, expect } from 'vitest';
import { watString } from '../../../src/wasm/WabtString.js';

describe('watString literal Unicode validation', () => {
  it('rejects literal lone surrogates instead of silently replacing them with U+FFFD', () => {
    expect(() => watString('"\ud800"', 1)).toThrow();
    expect(() => watString('"\udc00"', 1)).toThrow();
  });

  it('preserves valid surrogate pairs and an actual replacement character', () => {
    const source = '"😀\ufffd"';
    const decoded = watString(source, 1);
    expect(decoded.bytes).toEqual(Buffer.from('😀\ufffd', 'utf8'));
    expect(decoded.end).toBe(source.length);
  });
});
