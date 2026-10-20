import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist data character content', () => {
  it('decodes base64 contained in CDATA instead of silently dropping it', () => {
    const result = parseXmlPropertyList('<plist version="1.0"><data><![CDATA[SGVsbG8=]]></data></plist>');
    expect(result.value).toEqual(Uint8Array.from([72, 101, 108, 108, 111]));
  });

  it('concatenates ordinary text and CDATA before decoding base64', () => {
    const result = parseXmlPropertyList('<plist version="1.0"><data>SGVs<![CDATA[bG8=]]></data></plist>');
    expect(result.value).toEqual(Uint8Array.from([72, 101, 108, 108, 111]));
  });
});
