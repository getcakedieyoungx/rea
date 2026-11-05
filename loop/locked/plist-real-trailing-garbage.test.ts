import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';
import { UnknownPlistReal } from '../../../src/domain/apple/plistNumbers.js';

describe('XML plist real literals must be valid in their entirety', () => {
  it('does not invent a finite real from a malformed numeric prefix', () => {
    for (const literal of ['1.25garbage', '2e+', '3.5.7']) {
      const parsed = parseXmlPropertyList(`<plist><real>${literal}</real></plist>`);
      expect(parsed.value).toBeInstanceOf(UnknownPlistReal);
      expect(parsed.numberLiterals.reals.size).toBe(0);
    }
  });

  it('continues to decode complete decimal and exponent literals', () => {
    for (const [literal, expected] of [['1.25', 1.25], ['2e+3', 2000], ['-3.5e-2', -0.035]] as const) {
      const parsed = parseXmlPropertyList(`<plist><real>${literal}</real></plist>`);
      expect(parsed.value).toBe(expected);
      expect(parsed.numberLiterals.reals.has(expected)).toBe(true);
    }
  });
});
