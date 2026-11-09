import { describe, it, expect } from 'vitest';
import { parseAdbDirectoryListing } from '../../../src/adb/AdbDirectoryListing.js';

const record = (name: string): string =>
  `drwxr-xr-x|shell|shell|4096|2026-01-01 00:00:00.000000000 +0000\0${name}\0\0`;

describe('ADB direct-child directory entry names', () => {
  it('rejects dot and dot-dot as malformed child records without losing their text', () => {
    const records = [record('.'), record('..')];
    const result = parseAdbDirectoryListing(Buffer.from(records.join(''), 'utf8'));

    expect(result.entries).toEqual([]);
    expect(result.unparsedLines).toEqual(records);
  });

  it('still admits an ordinary hidden child directory', () => {
    const result = parseAdbDirectoryListing(Buffer.from(record('.config'), 'utf8'));

    expect(result.entries).toHaveLength(1);
    expect(result.entries[0]).toMatchObject({ name: '.config', kind: 'directory' });
    expect(result.unparsedLines).toEqual([]);
  });
});
