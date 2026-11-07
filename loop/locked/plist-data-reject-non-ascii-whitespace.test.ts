import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist base64 whitespace validation', () => {
  it('rejects a non-breaking space instead of silently removing invalid base64 content', () => {
    expect(() =>
      parseXmlPropertyList('<plist><data>AQ\u00a0ID</data></plist>'),
    ).toThrow();
  });

  it('continues to accept XML whitespace between base64 characters', () => {
    const parsed = parseXmlPropertyList(
      '<plist><data> A Q\tI\nD\r\n </data></plist>',
    );
    expect(parsed.value).toEqual(new Uint8Array([1, 2, 3]));
  });
});
