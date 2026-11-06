import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist real structural validation', () => {
  it('rejects nested elements instead of silently joining surrounding numeric text', () => {
    expect(() =>
      parseXmlPropertyList(
        '<plist><real>1<string>ignored</string>.25</real></plist>',
      ),
    ).toThrow();
  });

  it('continues to concatenate legitimate character data in a real', () => {
    expect(
      parseXmlPropertyList('<plist><real>1<![CDATA[.25]]></real></plist>').value,
    ).toBe(1.25);
  });
});
