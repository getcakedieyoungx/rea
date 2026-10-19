import { describe, it, expect } from 'vitest';
import { decodePeMachine } from '../../../src/domain/peMachine.js';

describe('COFF machine values must be unsigned 16-bit integers', () => {
  it('does not coerce out-of-range or fractional values into ReadyToRun machines', () => {
    const linuxX64 = 0x8664 ^ 0x7b79;
    expect(decodePeMachine(linuxX64 + 0x100000000)).toBeUndefined();
    expect(decodePeMachine(linuxX64 - 0x100000000)).toBeUndefined();
    expect(decodePeMachine(linuxX64 + 0.5)).toBeUndefined();
  });

  it('preserves valid ordinary and ReadyToRun machine decoding', () => {
    expect(decodePeMachine(0x8664)).toEqual({
      architecture: 'x86_64',
      nativeOsOverride: false,
    });
    expect(decodePeMachine(0x8664 ^ 0x7b79)).toEqual({
      architecture: 'x86_64',
      nativeOsOverride: true,
    });
  });
});
