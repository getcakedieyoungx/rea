import { describe, it, expect } from 'vitest';
import { decodeXmlText } from '../../../src/domain/propertyListKeys.js';

describe('XML character references must not create lone surrogates', () => {
  it('preserves surrogate references literally because they are not Unicode scalar values', () => {
    expect(decodeXmlText('&#xD800;')).toBe('&#xD800;');
    expect(decodeXmlText('&#55296;')).toBe('&#55296;');
    expect(decodeXmlText('&#xDFFF;')).toBe('&#xDFFF;');
    expect(decodeXmlText('&#57343;')).toBe('&#57343;');
  });

  it('still decodes valid scalar values adjacent to and above the surrogate range', () => {
    expect(decodeXmlText('&#xD7FF;&#xE000;&#x1F600;')).toBe('\uD7FF\uE000\u{1F600}');
  });
});
