import { describe, it, expect } from 'vitest';
import { readElfFixedHeader } from '../../../src/domain/elfFixedHeader.js';

describe('ELF Intel MCU family recognition', () => {
  it('recognizes EM_IAMCU as the 32-bit x86 family', () => {
    const bytes = Buffer.alloc(52);
    bytes.set([0x7f, 0x45, 0x4c, 0x46, 1, 1, 1]);
    bytes.writeUInt16LE(2, 16);
    bytes.writeUInt16LE(6, 18); // EM_IAMCU: Intel MCU, IA-32 architecture.
    bytes.writeUInt32LE(1, 20);
    bytes.writeUInt16LE(52, 40);

    expect(readElfFixedHeader(bytes)).toEqual({
      ok: true,
      value: {
        elfClass: 32,
        byteOrder: 'little',
        headerSize: 52,
        machine: 6,
        architecture: 'x86',
      },
    });
  });
});
