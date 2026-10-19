import { describe, it, expect } from 'vitest';
import { readElfFixedHeader } from '../../../src/domain/elfFixedHeader.js';

const elf64 = (littleEndian: boolean, machine: number): Buffer => {
  const bytes = Buffer.alloc(64);
  bytes.set([0x7f, 0x45, 0x4c, 0x46, 2, littleEndian ? 1 : 2, 1]);
  if (littleEndian) {
    bytes.writeUInt16LE(2, 16);
    bytes.writeUInt16LE(machine, 18);
    bytes.writeUInt32LE(1, 20);
    bytes.writeUInt16LE(64, 52);
  } else {
    bytes.writeUInt16BE(2, 16);
    bytes.writeUInt16BE(machine, 18);
    bytes.writeUInt32BE(1, 20);
    bytes.writeUInt16BE(64, 52);
  }
  return bytes;
};

describe('ELF PowerPC64 family recognition', () => {
  it('recognizes EM_PPC64 as the existing powerpc family in both byte orders', () => {
    for (const littleEndian of [false, true]) {
      const result = readElfFixedHeader(elf64(littleEndian, 21));
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(result.error);
      expect(result.value.machine).toBe(21);
      expect(result.value.elfClass).toBe(64);
      expect(result.value.byteOrder).toBe(littleEndian ? 'little' : 'big');
      expect(result.value.architecture).toBe('powerpc');
    }
  });

  it('keeps an unassigned machine unknown rather than classifying every ELF64 as powerpc', () => {
    const result = readElfFixedHeader(elf64(true, 0xffff));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.value.architecture).toBeNull();
  });
});
