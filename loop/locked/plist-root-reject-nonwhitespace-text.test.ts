import { describe, it, expect } from 'vitest';
import { parsePlistXml } from '../../../src/native/parsers/plist.js';

describe('plist root character content validation', () => {
  it('accepts formatting whitespace but rejects stray text around the root value', () => {
    const valid = parsePlistXml('<plist>\n  <string>kept</string>\n</plist>');
    expect(valid.ok).toBe(true);
    if (!valid.ok) throw valid.error;
    expect(valid.value.value).toBe('kept');

    for (const xml of [
      '<plist>unexpected<string>kept</string></plist>',
      '<plist><string>kept</string>unexpected</plist>',
      '<plist><![CDATA[unexpected]]><string>kept</string></plist>',
    ]) {
      const parsed = parsePlistXml(xml);
      expect(parsed.ok).toBe(false);
    }
  });
});
