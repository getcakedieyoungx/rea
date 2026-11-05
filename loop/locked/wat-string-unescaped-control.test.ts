import { describe, it, expect } from 'vitest';
import { watString } from '../../../src/wasm/WabtString.js';

describe('WAT string literal control characters', () => {
  it('rejects unescaped ASCII controls instead of accepting invalid WAT', () => {
    for (const control of ['\n', '\r', '\t', '\0', '\x1f', '\x7f']) {
      const source = `"before${control}after"`;
      expect(() => watString(source, 1)).toThrow();
    }
  });

  it('continues to decode controls represented by valid WAT escapes', () => {
    const source = String.raw`"before\n\r\t\00\1f\7fafter"`;
    const decoded = watString(source, 1);
    expect(decoded.bytes).toEqual(Buffer.from('before\n\r\t\0\x1f\x7fafter', 'utf8'));
    expect(decoded.end).toBe(source.length);
  });
});
