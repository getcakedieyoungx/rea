import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist dictionary key/value pairing', () => {
  it('rejects a dangling dictionary key instead of inventing an empty string value', () => {
    const xml = '<plist><dict><key>orphan</key></dict></plist>';
    expect(() => parseXmlPropertyList(xml)).toThrow(TypeError);
  });

  it('still accepts an explicitly supplied empty string value', () => {
    const xml = '<plist><dict><key>empty</key><string/></dict></plist>';
    expect(parseXmlPropertyList(xml).value).toEqual({ empty: '' });
  });
});
