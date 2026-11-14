import { describe, it, expect } from 'vitest';

import { readFatContainerHeader } from '../../../src/domain/apple/machoContainer.js';

const FAT_MAGIC = 0xcafebabe;
const ENTRY_BYTES = 20;

/** Build a big-endian FAT header (magic + count) padded to `length` bytes. */
const fatHeaderBytes = (count: number, length = 8): Uint8Array => {
  const bytes = new Uint8Array(length);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, FAT_MAGIC, false);
  view.setUint32(4, count, false);
  return bytes;
};

describe('FAT container header truncation classification', () => {
  it('reports a truncated architecture table as malformed, not as a non-FAT file', () => {
    // count = 2 declares an architecture table of 8 + 2 * 20 = 48 bytes, but
    // the container is only 8 bytes long. The magic is a real FAT magic and
    // the header itself is complete, so the only fault is the truncated table.
    const bytes = fatHeaderBytes(2);
    const fileSize = bytes.byteLength;

    // Currently returns { state: 'not-fat' }: the truncation is silently
    // reported as "this file is not a FAT container", so a corrupted
    // universal binary is analyzed as a thin, non-FAT artifact.
    expect(readFatContainerHeader(bytes, fileSize).state).toBe('malformed');
  });

  it('still parses a header whose architecture table fits in the file', () => {
    const count = 1;
    const bytes = fatHeaderBytes(count, 8 + count * ENTRY_BYTES);
    const header = readFatContainerHeader(bytes, bytes.byteLength);

    expect(header.state).toBe('parsed');
    if (header.state !== 'parsed') return;
    expect(header.magic).toBe(FAT_MAGIC);
    expect(header.count).toBe(count);
    expect(header.tableEnd).toBe(bytes.byteLength);
    expect(header.slices).toHaveLength(count);
  });
});