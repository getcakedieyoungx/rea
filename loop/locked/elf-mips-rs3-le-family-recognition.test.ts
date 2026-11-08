import { describe, it, expect } from 'vitest';
import { readElfFixedHeader } from '../../../src/domain/elfFixedHeader.js';

describe('ELF MIPS RS3000 little-endian family recognition', () => {
  it('recognizes EM_MIPS_RS3_LE without losing the original machine identifier', () => {
    const bytes = Buffer.alloc(52);
    bytes.set([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]);
    bytes.writeUInt16LE(2, 16);
    bytes.writeUInt16LE(10, 18); // EM_MIPS_RS3_LE
    bytes.writeUInt32LE(1, 20);
    bytes.writeUInt16LE(52, 40);

    expect(readElfFixedHeader(bytes)).toEqual({
      ok: true,
      value: {
        elfClass: 32,
        byteOrder: 'little',
        headerSize: 52,
        machine: 10,
        architecture: 'mips',
      },
    });
  });
});
