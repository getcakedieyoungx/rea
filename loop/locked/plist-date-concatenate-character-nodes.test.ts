import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist date character content', () => {
  it('decodes a date split between text and CDATA without truncating it', () => {
    const expected = new Date('2024-02-29T12:34:56Z');
    const plain = parseXmlPropertyList(
      '<plist><date>2024-02-29T12:34:56Z</date></plist>',
    );
    const split = parseXmlPropertyList(
      '<plist><date>2024-02-<![CDATA[29T12:34:56Z]]></date></plist>',
    );

    expect(plain.value).toEqual(expected);
    expect(split.value).toEqual(expected);
  });
});
