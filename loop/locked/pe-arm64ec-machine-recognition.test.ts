import { describe, it, expect } from 'vitest';
import { decodePeMachine, peOptionalHeaderMagic } from '../../../src/domain/peMachine.js';

describe('ARM64EC COFF machine recognition', () => {
  it('recognizes IMAGE_FILE_MACHINE_ARM64EC as a direct 64-bit ARM machine', () => {
    // Windows defines IMAGE_FILE_MACHINE_ARM64EC as 0xA641.
    // Its x64 interoperability ABI does not change its ARM64 instruction set.
    const decoded = decodePeMachine(0xa641);
    expect(decoded).toEqual({ architecture: 'arm64', nativeOsOverride: false });
    if (decoded === undefined) throw new Error('Expected ARM64EC recognition');
    expect(peOptionalHeaderMagic(decoded.architecture)).toBe(0x20b);
  });

  it('keeps ordinary ARM64 recognition unchanged', () => {
    expect(decodePeMachine(0xaa64)).toEqual({
      architecture: 'arm64',
      nativeOsOverride: false,
    });
  });
});
