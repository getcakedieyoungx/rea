import { describe, it, expect } from 'vitest';
import { parseGhidraInventoryResult } from '../../../src/ghidra/GhidraInventoryValues.js';

const segment = (start: string, end: string) => ({
  name: '.text',
  start,
  end,
  readable: true,
  writable: false,
  executable: true,
  permissions: { available: true, source: 'ghidra-memory-block' },
  provenance: 'ghidra-memory-block',
  address_space: 'ram',
  image_base: '0x1000',
  initialized: true,
  overlay: false,
  sections: [],
});

describe('Ghidra segment inclusive address range validation', () => {
  it('accepts a segment whose start is at or before its end', () => {
    expect(parseGhidraInventoryResult('list_segments', [
      segment('0x1000', '0x1fff'),
    ]).ok).toBe(true);
  });

  it('rejects a segment whose end precedes its start', () => {
    const parsed = parseGhidraInventoryResult('list_segments', [
      segment('0x2000', '0x1000'),
    ]);
    expect(parsed.ok).toBe(false);
  });
});
