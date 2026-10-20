import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist integer character content', () => {
  it('concatenates text and CDATA before parsing an integer', () => {
    const result = parseXmlPropertyList(
      '<plist><integer>4<![CDATA[2]]></integer></plist>',
    );
    expect(result.value).toBe(42);
    expect(result.numberLiterals.incomplete).toBe(false);
  });

  it('parses a hexadecimal integer entirely contained in CDATA', () => {
    const result = parseXmlPropertyList(
      '<plist><integer><![CDATA[0x2A]]></integer></plist>',
    );
    expect(result.value).toBe(42);
    expect(result.numberLiterals.incomplete).toBe(false);
  });
});
