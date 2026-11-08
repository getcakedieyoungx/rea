import { describe, it, expect } from 'vitest';
import { parsePlistXml } from '../../../src/native/parsers/plist.js';

describe('XML plist missing root value', () => {
  it('rejects an empty plist envelope rather than inventing an empty array', () => {
    const parsed = parsePlistXml('<plist version="1.0"/>');
    expect(parsed.ok).toBe(false);
  });

  it('still accepts an explicitly encoded empty root array', () => {
    const parsed = parsePlistXml('<plist version="1.0"><array/></plist>');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw parsed.error;
    expect(parsed.value.value).toEqual([]);
  });
});
