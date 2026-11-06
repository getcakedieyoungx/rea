import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist integer structural validation', () => {
  it('rejects a nested element instead of returning the numeric prefix', () => {
    expect(() =>
      parseXmlPropertyList(
        '<plist><integer>12<string>34</string></integer></plist>',
      ),
    ).toThrow();
  });

  it('still decodes an ordinary integer', () => {
    expect(
      parseXmlPropertyList('<plist><integer>1234</integer></plist>').value,
    ).toBe(1234);
  });
});
