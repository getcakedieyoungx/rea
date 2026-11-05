import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist processing instructions are not container members', () => {
  it('ignores processing instructions between array values', () => {
    const source = '<plist><array><string>before</string><?inspection keep?><string>after</string></array></plist>';
    expect(() => parseXmlPropertyList(source)).not.toThrow();
    expect(parseXmlPropertyList(source).value).toEqual(['before', 'after']);
  });

  it('ignores processing instructions between a dictionary key and its value', () => {
    const source = '<plist><dict><key>name</key><?inspection keep?><string>value</string></dict></plist>';
    expect(() => parseXmlPropertyList(source)).not.toThrow();
    expect(parseXmlPropertyList(source).value).toEqual({ name: 'value' });
  });
});
