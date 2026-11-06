import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist date element validation', () => {
  it('rejects a nested element rather than fabricating the Unix epoch', () => {
    expect(() =>
      parseXmlPropertyList(
        '<plist><date><string>2024-01-02T03:04:05Z</string></date></plist>',
      ),
    ).toThrow();
  });

  it('still accepts an ordinary date with character content', () => {
    expect(
      parseXmlPropertyList(
        '<plist><date>2024-01-02T03:04:05Z</date></plist>',
      ).value,
    ).toEqual(new Date('2024-01-02T03:04:05Z'));
  });
});
