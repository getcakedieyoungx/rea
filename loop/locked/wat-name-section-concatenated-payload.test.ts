import { describe, it, expect } from 'vitest';
import { parseWabtWat } from '../../../src/wasm/WabtWat.js';

describe('WAT name-section payload string concatenation', () => {
  it('concatenates payload strings before decoding module-name metadata', () => {
    const source = String.raw`(module (@custom "name" "\00\04" "\03abc"))`;
    expect(() => parseWabtWat(source)).not.toThrow();
    expect(parseWabtWat(source).debugModuleNames).toEqual(['abc']);
  });

  it('does not silently ignore a module-name subsection in a later string', () => {
    const source = String.raw`(module (@custom "name" "" "\00\04\03abc"))`;
    expect(parseWabtWat(source).debugModuleNames).toEqual(['abc']);
  });
});
