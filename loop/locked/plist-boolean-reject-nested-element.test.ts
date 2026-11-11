import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist booleans cannot contain nested values', () => {
  it('rejects nested elements instead of silently discarding them', () => {
    expect(() => parseXmlPropertyList('<plist><true><string>hidden</string></true></plist>')).toThrow();
    expect(() => parseXmlPropertyList('<plist><false><integer>1</integer></false></plist>')).toThrow();
  });

  it('still accepts empty boolean elements', () => {
    expect(parseXmlPropertyList('<plist><array><true/><false/></array></plist>').value).toEqual([true, false]);
  });
});
