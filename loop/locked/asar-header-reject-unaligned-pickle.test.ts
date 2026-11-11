import { describe, it, expect } from 'vitest';
import type { Stats } from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { admitAsarHeader } from '../../../src/artifacts/AsarHeader.js';

const handleFor = (headerBytes: number, payloadBytes: number) => {
  const prefix = Buffer.alloc(16);
  prefix.writeUInt32LE(4, 0);
  prefix.writeUInt32LE(headerBytes, 4);
  prefix.writeUInt32LE(payloadBytes, 8);
  prefix.writeUInt32LE(2, 12);
  return {
    stat: async () => ({ size: 64, isFile: () => true }) as Stats,
    read: (async (buffer: Buffer) => {
      prefix.copy(buffer);
      return { bytesRead: prefix.length, buffer };
    }) as FileHandle['read'],
  };
};

describe('ASAR pickle alignment', () => {
  it('rejects a header that omits required four-byte pickle padding', async () => {
    await expect(admitAsarHeader(handleFor(10, 6))).rejects.toThrow();
  });

  it('accepts the aligned extent for a two-byte JSON string', async () => {
    await expect(admitAsarHeader(handleFor(12, 8))).resolves.toEqual({
      archiveBytes: 64,
      headerBytes: 12,
      jsonBytes: 2,
    });
  });
});
