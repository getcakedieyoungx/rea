import { describe, it, expect } from 'vitest';
import { parsePlistXml } from '../../../src/native/parsers/plist.js';

describe('plist string character content', () => {
  it('rejects nested elements instead of silently discarding them', () => {
    const result = parsePlistXml(
      '<plist version="1.0"><string>before<true/>after</string></plist>',
    );
    expect(result.ok).toBe(false);
  });

  it('preserves text and CDATA while ignoring comments in valid strings', () => {
    const result = parsePlistXml(
      '<plist version="1.0"><string>before<!-- note --><![CDATA[<true/>]]>after</string></plist>',
    );
    expect(result.ok).toBe(true);
    if (!result.ok) throw result.error;
    expect(result.value.value).toBe('before<true/>after');
  });
});
