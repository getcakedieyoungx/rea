import { describe, it, expect } from 'vitest';
import { decodeXmlText } from '../../../src/domain/propertyListKeys.js';

describe('XML hexadecimal character reference syntax', () => {
  it('preserves an uppercase X instead of decoding a non-reference', () => {
    // XML CharRef permits "&#x" but not "&#X"; literal text must survive.
    expect(decodeXmlText('before &#X41; after')).toBe('before &#X41; after');
  });

  it('still decodes uppercase hexadecimal digits after a lowercase x', () => {
    expect(decodeXmlText('&#x4A; &#x4a; &#74; &amp;')).toBe('J J J &');
  });
});
