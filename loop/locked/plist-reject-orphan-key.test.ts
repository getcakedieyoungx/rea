import { describe, it, expect } from 'vitest';
import { parsePlistXml } from '../../../src/native/parsers/plist.js';

describe('plist keys are dictionary member names, not standalone values', () => {
  it('rejects a key used as the root value or as an array item', () => {
    expect(parsePlistXml('<plist><key>orphan</key></plist>').ok).toBe(false);
    expect(parsePlistXml('<plist><array><key>orphan</key></array></plist>').ok).toBe(false);
  });

  it('continues to decode keys in dictionaries and strings in arrays', () => {
    const result = parsePlistXml('<plist><dict><key>items</key><array><string>orphan</string></array></dict></plist>');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.value).toEqual({ items: ['orphan'] });
    }
  });
});
