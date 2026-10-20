import { describe, it, expect } from 'vitest';

import { watString } from '../../../src/wasm/WabtString.js';

describe('WAT literal Unicode scalar validation', () => {
  it('rejects unpaired UTF-16 surrogates instead of silently writing replacement bytes', () => {
    // Raw WAT characters must be Unicode scalar values, not lone surrogates.
    // Currently fails: the function returns UTF-8 for U+FFFD instead of throwing.
    expect(() => watString('\ud800"', 0)).toThrow();
    expect(() => watString('a\udc00b"', 0)).toThrow();
  });

  it('preserves paired surrogates and an actual replacement character', () => {
    const supplementary = watString('\ud83d\ude00"', 0);
    expect(supplementary.bytes).toEqual(Buffer.from([0xf0, 0x9f, 0x98, 0x80]));
    expect(supplementary.end).toBe(3);
    expect(watString('\ufffd"', 0).bytes).toEqual(Buffer.from([0xef, 0xbf, 0xbd]));
  });
});
