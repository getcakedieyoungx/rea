import { describe, it, expect } from 'vitest';

import { readPngHeaderDimensions } from '../../../src/domain/pngHeader.js';

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

// signature(8) + chunk length(4) + "IHDR"(4) + 13 data bytes + crc(4)
const buildIhdr = (methods: {
  readonly bitDepth?: number;
  readonly colourType?: number;
  readonly compression?: number;
  readonly filter?: number;
  readonly interlace?: number;
}): Buffer => {
  const header = Buffer.alloc(33);
  Buffer.from(PNG_SIGNATURE).copy(header, 0);
  header.writeUInt32BE(13, 8);
  header.write('IHDR', 12, 'latin1');
  header.writeUInt32BE(640, 16);
  header.writeUInt32BE(480, 20);
  header[24] = methods.bitDepth ?? 8;
  header[25] = methods.colourType ?? 6;
  header[26] = methods.compression ?? 0;
  header[27] = methods.filter ?? 0;
  header[28] = methods.interlace ?? 0;
  return header;
};

describe('PNG IHDR header method bytes', () => {
  it('rejects an IHDR that declares a method the specification does not define', () => {
    // PNG requires compression method 0 and filter method 0; only 0 and 1 are
    // defined interlace methods. A header carrying any other value is not a
    // byte-faithful PNG header, so no dimensions may be reported from it.
    // Currently fails: every one of these returns { width: 640, height: 480 }.
    expect(readPngHeaderDimensions(buildIhdr({ compression: 1 }))).toBeUndefined();
    expect(readPngHeaderDimensions(buildIhdr({ filter: 1 }))).toBeUndefined();
    expect(readPngHeaderDimensions(buildIhdr({ interlace: 2 }))).toBeUndefined();
  });

  it('keeps reading dimensions from headers that use defined method values', () => {
    expect(readPngHeaderDimensions(buildIhdr({}))).toEqual({
      width: 640,
      height: 480,
    });
    expect(readPngHeaderDimensions(buildIhdr({ interlace: 1 }))).toEqual({
      width: 640,
      height: 480,
    });
    expect(
      readPngHeaderDimensions(buildIhdr({ bitDepth: 1, colourType: 0 })),
    ).toEqual({ width: 640, height: 480 });
  });
});