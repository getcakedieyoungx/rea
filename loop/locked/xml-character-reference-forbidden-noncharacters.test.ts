import { describe, it, expect } from 'vitest';
import { decodeXmlText } from '../../../src/domain/propertyListKeys.js';

describe('XML character references exclude forbidden BMP noncharacters', () => {
  it('preserves references to U+FFFE and U+FFFF instead of emitting invalid XML characters', () => {
    expect(decodeXmlText('&#xFFFE;')).toBe('&#xFFFE;');
    expect(decodeXmlText('&#65534;')).toBe('&#65534;');
    expect(decodeXmlText('&#xFFFF;')).toBe('&#xFFFF;');
    expect(decodeXmlText('&#65535;')).toBe('&#65535;');
  });

  it('still expands neighboring legal XML characters and supplementary code points', () => {
    expect(decodeXmlText('&#xFFFD;')).toBe('\uFFFD');
    expect(decodeXmlText('&#x10000;')).toBe('\u{10000}');
  });
});
