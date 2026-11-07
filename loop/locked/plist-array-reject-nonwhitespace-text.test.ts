import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist array character content', () => {
  it('rejects non-whitespace text between array values instead of silently discarding it', () => {
    expect(() => parseXmlPropertyList(
      '<plist><array>discarded<string>kept</string></array></plist>',
    )).toThrow();
  });

  it('continues to accept formatting whitespace and comments between array values', () => {
    const parsed = parseXmlPropertyList(
      '<plist><array>\n  <!-- formatting -->\n  <string>kept</string>\n</array></plist>',
    );
    expect(parsed.value).toEqual(['kept']);
  });
});
