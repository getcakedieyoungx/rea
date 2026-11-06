import { describe, it, expect } from 'vitest';
import { readElfFixedHeader } from '../../../src/domain/elfFixedHeader.js';

describe('ELF PowerPC64 family recognition', () => {
  it('recognizes EM_PPC64 as the powerpc family in both byte orders', () => {
    for (const littleEndian of [true, false]) {
      const bytes = Buffer.alloc(64);
      bytes.set([0x7f, 0x45, 0x4c, 0x46, 2, littleEndian ? 1 : 2, 1]);
      if (littleEndian) {
        bytes.writeUInt16LE(2, 16);
        bytes.writeUInt16LE(21, 18); // EM_PPC64
        bytes.writeUInt32LE(1, 20);
        bytes.writeUInt16LE(64, 52);
      } else {
        bytes.writeUInt16BE(2, 16);
        bytes.writeUInt16BE(21, 18);
        bytes.writeUInt32BE(1, 20);
        bytes.writeUInt16BE(64, 52);
      }
      expect(readElfFixedHeader(bytes)).toEqual({
        ok: true,
        value: {
          elfClass: 64,
          byteOrder: littleEndian ? 'little' : 'big',
          headerSize: 64,
          machine: 21,
          architecture: 'powerpc',
        },
      });
    }
  });
});
