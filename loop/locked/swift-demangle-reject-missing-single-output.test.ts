import { describe, it, expect } from 'vitest';
import { parseDemangledSymbols } from '../../../src/native/parsers/demangle.js';

describe('swift-demangle output record validation', () => {
  it('rejects completely missing output for a single requested symbol', () => {
    expect(() => parseDemangledSymbols(['$s4main4testyyF'], '')).toThrow(TypeError);
  });

  it('continues to accept an empty batch and a genuine single output record', () => {
    expect(parseDemangledSymbols([], '')).toEqual([]);
    expect(parseDemangledSymbols(['$s4main4testyyF'], 'main.test() -> ()\n')).toEqual([
      {
        input: '$s4main4testyyF',
        output: 'main.test() -> ()',
        status: 'demangled',
      },
    ]);
  });
});
