import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist dictionary character content', () => {
  it('rejects non-whitespace text instead of silently discarding it', () => {
    const source = '<plist><dict><key>answer</key>lost text<integer>42</integer></dict></plist>';
    expect(() => parseXmlPropertyList(source)).toThrow();
  });

  it('allows formatting whitespace and comments between keys and values', () => {
    const source = '<plist><dict>\n  <key>answer</key>\n  <!-- value -->\n  <integer>42</integer>\n</dict></plist>';
    expect(parseXmlPropertyList(source).value).toEqual({ answer: 42 });
  });
});
