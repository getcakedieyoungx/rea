import { describe, it, expect } from 'vitest';
import { parseWabtWat } from '../../../src/wasm/WabtWat.js';

describe('WAT comments as module token separators', () => {
  it('accepts a block comment immediately following the module keyword', () => {
    const text = '(module(; module comment ;))';
    expect(() => parseWabtWat(text)).not.toThrow();
    expect(parseWabtWat(text)).toEqual(parseWabtWat('(module)'));
  });

  it('accepts a line comment immediately following the module keyword', () => {
    const text = '(module;; module comment\n)';
    expect(() => parseWabtWat(text)).not.toThrow();
    expect(parseWabtWat(text)).toEqual(parseWabtWat('(module)'));
  });
});
