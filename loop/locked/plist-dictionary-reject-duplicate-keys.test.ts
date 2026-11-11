import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist dictionary key uniqueness', () => {
  it('rejects duplicate decoded keys instead of silently overwriting a value', () => {
    const xml = '<plist><dict><key>a&amp;b</key><string>first</string><key>a&#38;b</key><string>second</string></dict></plist>';
    expect(() => parseXmlPropertyList(xml)).toThrow(TypeError);
  });

  it('allows the same key in distinct dictionaries', () => {
    const xml = '<plist><array><dict><key>name</key><string>first</string></dict><dict><key>name</key><string>second</string></dict></array></plist>';
    expect(parseXmlPropertyList(xml).value).toEqual([
      { name: 'first' },
      { name: 'second' },
    ]);
  });
});
