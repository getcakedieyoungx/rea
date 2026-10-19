import { describe, it, expect } from 'vitest';
import { decodeXmlText } from '../../../src/domain/propertyListKeys.js';

describe('XML hexadecimal character reference marker case', () => {
  it('preserves uppercase X spellings because XML requires a lowercase x marker', () => {
    expect(decodeXmlText('before &#X41; after')).toBe('before &#X41; after');
    expect(decodeXmlText('&#X1F600;')).toBe('&#X1F600;');
  });

  it('still decodes valid lowercase x markers with either case of hexadecimal digits', () => {
    expect(decodeXmlText('&#x4a;&#x4A;')).toBe('JJ');
    expect(decodeXmlText('&#65;&amp;')).toBe('A&');
  });
});
