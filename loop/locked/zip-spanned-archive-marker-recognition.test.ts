import { describe, it, expect } from 'vitest';
import { hasZipSignature } from '../../../src/domain/zipPackageFormat.js';

describe('hasZipSignature spanned-archive marker', () => {
  it('recognizes the PK00 marker that starts the first segment of a split archive', () => {
    // Failing expectation today: hasZipSignature returns false for 0x50 0x4b 0x30 0x30.
    expect(hasZipSignature(Uint8Array.of(0x50, 0x4b, 0x30, 0x30))).toBe(true);
  });

  it('still recognizes local-header and empty-archive signatures', () => {
    expect(hasZipSignature(Uint8Array.of(0x50, 0x4b, 0x03, 0x04))).toBe(true);
    expect(hasZipSignature(Uint8Array.of(0x50, 0x4b, 0x05, 0x06))).toBe(true);
    expect(hasZipSignature(Uint8Array.of(0x50, 0x4b, 0x30))).toBe(false);
  });
});