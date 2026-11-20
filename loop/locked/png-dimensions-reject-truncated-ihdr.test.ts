import { describe, expect, it } from 'vitest';

import { readPngHeaderDimensions } from '../../../src/domain/pngHeader.js';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/**
 * Signature plus an IHDR chunk that declares its real 13 data bytes but is cut
 * short at `byteLength` total bytes, so the declared data can not be present.
 */
const truncatedIhdr = (byteLength: number): Buffer => {
  const header = Buffer.alloc(byteLength);
  PNG_SIGNATURE.copy(header, 0);
  header.writeUInt32BE(13, 8);
  header.write('IHDR', 12, 'latin1');
  if (byteLength >= 20) header.writeUInt32BE(1280, 16);
  if (byteLength >= 24) header.writeUInt32BE(720, 20);
  return header;
};

/** The smallest complete IHDR chunk: 13 data bytes plus its CRC slot. */
const completeIhdr = (): Buffer => {
  const header = Buffer.alloc(33);
  PNG_SIGNATURE.copy(header, 0);
  header.writeUInt32BE(13, 8);
  header.write('IHDR', 12, 'latin1');
  header.writeUInt32BE(1280, 16);
  header.writeUInt32BE(720, 20);
  header[24] = 8; // bit depth
  header[25] = 6; // colour type: RGBA
  header[26] = 0; // compression method
  header[27] = 0; // filter method
  header[28] = 0; // interlace method
  return header;
};

describe('PNG IHDR truncation', () => {
  it('rejects an IHDR chunk whose declared data bytes are missing', () => {
    // 24 bytes is the current acceptance floor: signature, length, type and
    // only the first 8 of the 13 declared IHDR data bytes.
    expect(readPngHeaderDimensions(truncatedIhdr(24))).toBeUndefined();
    // 28 bytes still stops before the chunk's final interlace byte.
    expect(readPngHeaderDimensions(truncatedIhdr(28))).toBeUndefined();
  });

  it('still reports dimensions from a complete IHDR chunk', () => {
    expect(readPngHeaderDimensions(completeIhdr())).toEqual({
      width: 1280,
      height: 720,
    });
  });
});