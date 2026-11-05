import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist data character content', () => {
  it('decodes base64 inside CDATA instead of silently dropping the bytes', () => {
    const parsed = parseXmlPropertyList(
      '<plist><data><![CDATA[AQID]]></data></plist>',
    );
    expect(parsed.value).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('concatenates text and CDATA before decoding base64', () => {
    const parsed = parseXmlPropertyList(
      '<plist><data>AQ<![CDATA[ID]]>BA==</data></plist>',
    );
    expect(parsed.value).toEqual(new Uint8Array([1, 2, 3, 4]));
  });
});
