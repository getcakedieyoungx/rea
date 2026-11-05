import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';
import { UnknownPlistReal } from '../../../src/domain/apple/plistNumbers.js';

describe('XML plist integer literals require a complete numeric identity', () => {
  it('does not turn malformed integer text into a plausible numeric prefix', () => {
    for (const literal of ['42junk', '12.5', '2e3', '0xG']) {
      const parsed = parseXmlPropertyList(`<plist><integer>${literal}</integer></plist>`);
      expect(parsed.value).toBeInstanceOf(UnknownPlistReal);
      expect(parsed.numberLiterals.incomplete).toBe(true);
      expect(parsed.numberLiterals.integers.size).toBe(0);
    }
  });

  it('preserves complete signed decimal and hexadecimal integers', () => {
    for (const [literal, expected] of [['42', 42], ['-12', -12], ['+7', 7], ['0x2A', 42], ['-0x2A', -42]] as const) {
      const parsed = parseXmlPropertyList(`<plist><integer>${literal}</integer></plist>`);
      expect(parsed.value).toBe(expected);
      expect(parsed.numberLiterals.incomplete).toBe(false);
    }
  });
});
