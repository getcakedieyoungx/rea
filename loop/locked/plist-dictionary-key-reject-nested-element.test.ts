import { describe, it, expect } from 'vitest';
import { parsePlistXml } from '../../../src/native/parsers/plist.js';

describe('plist dictionary key character content', () => {
  it('rejects nested elements instead of silently truncating the key', () => {
    const result = parsePlistXml(
      '<plist version="1.0"><dict><key>before<true/>after</key><string>value</string></dict></plist>',
    );
    expect(result.ok).toBe(false);
  });

  it('preserves text and CDATA around comments in valid dictionary keys', () => {
    const result = parsePlistXml(
      '<plist version="1.0"><dict><key>before<!-- note --><![CDATA[<true/>]]>after</key><string>value</string></dict></plist>',
    );
    expect(result.ok).toBe(true);
    if (!result.ok) throw result.error;
    expect(result.value.value).toEqual({ 'before<true/>after': 'value' });
  });
});
