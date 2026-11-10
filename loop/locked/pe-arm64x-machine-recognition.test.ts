import { describe, it, expect } from 'vitest';
import { decodePeMachine, peOptionalHeaderMagic } from '../../../src/domain/peMachine.js';

describe('ARM64X COFF machine recognition', () => {
  it('recognizes IMAGE_FILE_MACHINE_ARM64X as a direct ARM64-family PE32+ machine', () => {
    // IMAGE_FILE_MACHINE_ARM64X identifies a hybrid ARM64/ARM64EC image.
    const decoded = decodePeMachine(0xa64e);
    expect(decoded).toEqual({ architecture: 'arm64', nativeOsOverride: false });
    if (decoded === undefined) throw new Error('Expected ARM64X recognition');
    expect(peOptionalHeaderMagic(decoded.architecture)).toBe(0x20b);
  });

  it('preserves ordinary ARM64 machine decoding', () => {
    expect(decodePeMachine(0xaa64)).toEqual({
      architecture: 'arm64',
      nativeOsOverride: false,
    });
  });
});
