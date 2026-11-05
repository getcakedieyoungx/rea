import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist null value preservation', () => {
  it('preserves accepted null values and their positions inside arrays', () => {
    expect(parseXmlPropertyList('<plist><null/></plist>').value).toBeNull();
    const xml = '<plist><array><string>before</string><null/><string>after</string></array></plist>';
    expect(parseXmlPropertyList(xml).value).toEqual(['before', null, 'after']);
  });
});
