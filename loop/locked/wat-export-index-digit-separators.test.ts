import { describe, it, expect } from 'vitest';
import { parseWabtWat } from '../../../src/wasm/WabtWat.js';

describe('WAT export indices with digit separators', () => {
  it('resolves a valid separated natural-number index to the existing function', () => {
    const parsed = parseWabtWat(
      '(module (func $value (result i32) i32.const 7) (export "value" (func 0_0)))',
    );

    expect(parsed.interface.entries).toHaveLength(1);
    expect(parsed.interface.entries[0]).toMatchObject({
      direction: 'export',
      name: 'value',
      kind: 'func',
      index: 0,
      signature: { kind: 'func', params: [], results: ['i32'] },
      issue: null,
    });
  });
});
