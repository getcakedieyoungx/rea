import { describe, it, expect } from 'vitest';
import { decodePeMachine } from '../../../src/domain/peMachine.js';

describe('COFF machine numeric domain', () => {
  const linuxX86Machine = 0x014c ^ 0x7b79;

  it('rejects fractional and overflowing values instead of coercing them into machine codes', () => {
    expect(decodePeMachine(linuxX86Machine + 0.5)).toBeUndefined();
    expect(decodePeMachine(linuxX86Machine + 0x1_0000_0000)).toBeUndefined();
  });

  it('continues to recognize actual 16-bit machine codes', () => {
    expect(decodePeMachine(0x014c)).toEqual({
      architecture: 'x86',
      nativeOsOverride: false,
    });
    expect(decodePeMachine(linuxX86Machine)).toEqual({
      architecture: 'x86',
      nativeOsOverride: true,
    });
  });
});
