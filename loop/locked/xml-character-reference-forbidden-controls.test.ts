import { describe, it, expect } from 'vitest';
import { decodeXmlText } from '../../../src/domain/propertyListKeys.js';

describe('XML character references must not introduce forbidden control characters', () => {
  it('preserves references to NUL and controls excluded by the XML 1.0 Char production', () => {
    expect(decodeXmlText('&#0;')).toBe('&#0;');
    expect(decodeXmlText('&#x1;')).toBe('&#x1;');
    expect(decodeXmlText('&#11;')).toBe('&#11;');
    expect(decodeXmlText('&#x1F;')).toBe('&#x1F;');
  });

  it('still expands the three control characters that XML 1.0 permits', () => {
    expect(decodeXmlText('&#9;&#xA;&#13;')).toBe('\t\n\r');
  });
});
