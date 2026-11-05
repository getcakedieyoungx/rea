import { describe, it, expect } from 'vitest';
import { parsePngDimensions } from '../../../src/adb/AdbShellOutput.js';

const header = (chunkType: string): Buffer => {
  const bytes = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes);
  bytes.writeUInt32BE(13, 8);
  bytes.write(chunkType, 12, 'ascii');
  bytes.writeUInt32BE(640, 16);
  bytes.writeUInt32BE(480, 20);
  bytes[24] = 8;
  bytes[25] = 2;
  return bytes;
};

describe('parsePngDimensions first chunk validation', () => {
  it('does not interpret a non-IHDR chunk payload as image dimensions', () => {
    expect(parsePngDimensions(header('IDAT'))).toEqual({ width: null, height: null });
  });

  it('still reads dimensions from an IHDR header in a Uint8Array subview', () => {
    const bytes = Buffer.concat([Buffer.alloc(5), header('IHDR')]);
    expect(parsePngDimensions(bytes.subarray(5))).toEqual({ width: 640, height: 480 });
  });
});
