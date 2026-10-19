import { describe, it, expect } from 'vitest';
import { parsePngDimensions } from '../../../src/adb/AdbShellOutput.js';

const onePixelPng = () => Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9ZkAAAAASUVORK5CYII=',
  'base64',
);

describe('parsePngDimensions validates the dimension chunk', () => {
  it('reads dimensions from a PNG whose first chunk is IHDR', () => {
    expect(parsePngDimensions(onePixelPng())).toEqual({ width: 1, height: 1 });
  });

  it('does not interpret an IDAT payload as IHDR dimensions', () => {
    const bytes = onePixelPng();
    bytes.write('IDAT', 12, 'ascii');
    expect(parsePngDimensions(bytes)).toEqual({ width: null, height: null });
  });
});
