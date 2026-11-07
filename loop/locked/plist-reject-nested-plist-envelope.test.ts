import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist envelope placement', () => {
  it('rejects a plist envelope used as an array value', () => {
    const xml = '<plist version="1.0"><array><plist version="1.0"><string>nested</string></plist></array></plist>';
    expect(() => parseXmlPropertyList(xml)).toThrow();
  });

  it('continues to decode an ordinary nested array', () => {
    const xml = '<plist version="1.0"><array><array><string>nested</string></array></array></plist>';
    expect(parseXmlPropertyList(xml).value).toEqual([['nested']]);
  });
});
