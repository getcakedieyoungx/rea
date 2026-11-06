import { describe, it, expect } from 'vitest';
import { parsePlistXml } from '../../../src/native/parsers/plist.js';

describe('XML plist root value cardinality', () => {
  it('rejects multiple values directly inside the plist envelope', () => {
    const parsed = parsePlistXml(
      '<plist version="1.0"><string>first</string><string>second</string></plist>',
    );
    expect(parsed.ok).toBe(false);
  });

  it('accepts multiple values inside a single root array', () => {
    const parsed = parsePlistXml(
      '<plist version="1.0"><array><string>first</string><string>second</string></array></plist>',
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw parsed.error;
    expect(parsed.value.value).toEqual(['first', 'second']);
  });
});
