import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist invalid date text', () => {
  it('rejects an unparseable date instead of returning an Invalid Date object', () => {
    expect(() =>
      parseXmlPropertyList('<plist><date>not-a-date</date></plist>'),
    ).toThrow(TypeError);
  });

  it('continues decoding a valid UTC date', () => {
    expect(
      parseXmlPropertyList('<plist><date>2024-01-02T03:04:05Z</date></plist>').value,
    ).toEqual(new Date('2024-01-02T03:04:05Z'));
  });
});
