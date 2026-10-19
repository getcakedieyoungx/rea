import { describe, it, expect } from 'vitest';

import { decodeXmlText } from '../../../src/domain/propertyListKeys.js';

/**
 * `decodeXmlText` expands XML character references, and its documented contract
 * is that a reference naming something outside Unicode stays as written
 * ("A reference beyond Unicode stays as written"). XML 1.0's `Char` production
 * excludes the surrogate range `#xD800`-`#xDFFF` and `#x0`, so those references
 * name no character at all. The current guard only compares against 0x10FFFF,
 * so `String.fromCodePoint` turns `&#xD800;` into a lone surrogate and `&#x0;`
 * into NUL — text no XML document can carry and no JSON string can represent.
 */
describe('XML character reference decoding', () => {
  it('leaves references that name no XML character as written', () => {
    expect(decodeXmlText('&#xD800;')).toBe('&#xD800;');
    expect(decodeXmlText('&#xDFFF;')).toBe('&#xDFFF;');
    expect(decodeXmlText('a&#x0;b')).toBe('a&#x0;b');
  });

  it('still decodes references that do name XML characters', () => {
    expect(decodeXmlText('&#x41;')).toBe('A');
    expect(decodeXmlText('&#65;')).toBe('A');
    expect(decodeXmlText('&amp;')).toBe('&');
  });
});