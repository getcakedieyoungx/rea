import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist boolean elements must be empty', () => {
  it('rejects character content rather than silently converting it to a boolean', () => {
    expect(() => parseXmlPropertyList('<plist><true>false</true></plist>')).toThrow();
    expect(() => parseXmlPropertyList('<plist><false>true</false></plist>')).toThrow();
  });

  it('continues to decode empty boolean elements', () => {
    const parsed = parseXmlPropertyList(
      '<plist><array><true/><false/></array></plist>',
    );
    expect(parsed.value).toEqual([true, false]);
  });
});
