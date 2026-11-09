import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist real XML whitespace validation', () => {
  it('rejects non-XML whitespace surrounding a real literal', () => {
    expect(() => parseXmlPropertyList('<plist><real>\u00a01.5</real></plist>')).toThrow();
    expect(() => parseXmlPropertyList('<plist><real>1.5\u2003</real></plist>')).toThrow();
  });

  it('accepts XML whitespace surrounding the same real literal', () => {
    expect(parseXmlPropertyList('<plist><real> \t\n1.5\r </real></plist>').value).toBe(1.5);
  });
});
