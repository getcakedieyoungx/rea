import { describe, it, expect } from 'vitest';
import { parseWabtWat } from '../../../src/wasm/WabtWat.js';

describe('WAT empty function definitions retain their index-space slot', () => {
  it('resolves an exported empty function without requiring trailing whitespace', () => {
    const parsed = parseWabtWat('(module (func) (export "run" (func 0)))');

    expect(parsed.interface.entries).toHaveLength(1);
    expect(parsed.interface.entries[0]).toMatchObject({
      direction: 'export',
      name: 'run',
      kind: 'func',
      index: 0,
      signature: { kind: 'func', params: [], results: [] },
      issue: null,
    });
  });

  it('does not shift later function indices when the first definition is empty', () => {
    const parsed = parseWabtWat(
      '(module (func) (func (result i32) i32.const 7) (export "value" (func 1)))',
    );

    expect(parsed.interface.entries[0]).toMatchObject({
      name: 'value',
      index: 1,
      signature: { kind: 'func', params: [], results: ['i32'] },
      issue: null,
    });
  });
});
