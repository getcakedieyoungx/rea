import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist processing instructions', () => {
  it('ignores processing instructions between array elements', () => {
    const xml = '<plist version="1.0"><array><string>first</string><?note keep-going?><string>second</string></array></plist>';
    expect(() => parseXmlPropertyList(xml)).not.toThrow();
    expect(parseXmlPropertyList(xml).value).toEqual(['first', 'second']);
  });

  it('ignores processing instructions between a dictionary key and its value', () => {
    const xml = '<plist version="1.0"><dict><key>name</key><?note keep-going?><string>REA</string></dict></plist>';
    expect(() => parseXmlPropertyList(xml)).not.toThrow();
    expect(parseXmlPropertyList(xml).value).toEqual({ name: 'REA' });
  });
});
