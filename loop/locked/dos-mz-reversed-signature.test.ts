import { describe, it, expect } from 'vitest';
import { dosMzImageByteLength, parseDosMzHeader } from '../../../src/domain/dosMz.js';

describe('DOS executable signature variants', () => {
  it('accepts the DOS-supported ZM signature with the same little-endian header layout as MZ', () => {
    const mz = Buffer.alloc(33);
    mz.write('MZ', 0, 'ascii');
    mz.writeUInt16LE(33, 2);
    mz.writeUInt16LE(1, 4);
    mz.writeUInt16LE(2, 8);
    mz.writeUInt16LE(28, 24);
    mz[32] = 0xc3;
    const zm = Buffer.from(mz);
    zm.write('ZM', 0, 'ascii');

    expect(dosMzImageByteLength(mz)).toEqual({ ok: true, value: 33 });
    expect(parseDosMzHeader(mz).ok).toBe(true);
    expect(dosMzImageByteLength(zm)).toEqual({ ok: true, value: 33 });
    expect(parseDosMzHeader(zm)).toEqual(parseDosMzHeader(mz));
  });
});
