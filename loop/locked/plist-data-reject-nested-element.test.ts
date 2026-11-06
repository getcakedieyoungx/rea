import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist data content validation', () => {
  it('rejects nested elements instead of silently dropping their content', () => {
    expect(() =>
      parseXmlPropertyList(
        '<plist><data>SGV<string>ignored</string>sbG8=</data></plist>',
      ),
    ).toThrow();
  });

  it('continues to decode ordinary base64 data with whitespace', () => {
    expect(
      parseXmlPropertyList('<plist><data> SGVs\nbG8= </data></plist>').value,
    ).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
  });
});
