import { describe, it, expect } from 'vitest';
import { parseWabtWat } from '../../../src/wasm/WabtWat.js';

describe('WAT line comment termination', () => {
  it('ends a line comment at a standalone carriage return', () => {
    const source = '(module ;; comment\r)';
    expect(() => parseWabtWat(source)).not.toThrow();
    expect(parseWabtWat(source)).toEqual(parseWabtWat('(module)'));
  });

  it('continues to accept LF and CRLF comment terminators', () => {
    const emptyModule = parseWabtWat('(module)');
    expect(parseWabtWat('(module ;; comment\n)')).toEqual(emptyModule);
    expect(parseWabtWat('(module ;; comment\r\n)')).toEqual(emptyModule);
  });
});
