import { describe, it, expect } from 'vitest';
import { parsePngDimensions } from '../../../src/adb/AdbShellOutput.js';

const pngHeader = (width: number, height: number): Uint8Array => {
  const bytes = new Uint8Array(29);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const view = new DataView(bytes.buffer);
  view.setUint32(8, 13);
  bytes.set([0x49, 0x48, 0x44, 0x52], 12);
  view.setUint32(16, width);
  view.setUint32(20, height);
  bytes.set([8, 2, 0, 0, 0], 24);
  return bytes;
};

describe('PNG dimension upper bound', () => {
  it('rejects dimensions above the PNG maximum of 2^31 - 1', () => {
    for (const [width, height] of [
      [0x80000000, 480],
      [640, 0x80000000],
      [0xffffffff, 480],
    ] as const) {
      expect(parsePngDimensions(pngHeader(width, height))).toEqual({
        width: null,
        height: null,
      });
    }
  });

  it('accepts the maximum legal header dimension without allocating pixels', () => {
    expect(parsePngDimensions(pngHeader(0x7fffffff, 1))).toEqual({
      width: 0x7fffffff,
      height: 1,
    });
  });
});
