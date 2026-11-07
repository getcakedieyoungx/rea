import { describe, it, expect } from 'vitest';
import { parsePngDimensions } from '../../../src/adb/AdbShellOutput.js';

// A PNG header through the IHDR data; this helper only reads header dimensions.
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

describe('PNG dimensions must be nonzero', () => {
  it('rejects a zero width or height instead of reporting invalid image dimensions', () => {
    for (const [width, height] of [[0, 480], [640, 0], [0, 0]]) {
      expect(parsePngDimensions(pngHeader(width!, height!))).toEqual({
        width: null,
        height: null,
      });
    }
  });

  it('still reads positive dimensions from an IHDR header', () => {
    expect(parsePngDimensions(pngHeader(640, 480))).toEqual({
      width: 640,
      height: 480,
    });
  });
});
