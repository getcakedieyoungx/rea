import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist null elements cannot hide nested values', () => {
  it('rejects a nested scalar instead of silently discarding it as null', () => {
    expect(() => parseXmlPropertyList('<plist><null><string>lost</string></null></plist>')).toThrow();
  });

  it('preserves the supported empty null scalar', () => {
    expect(parseXmlPropertyList('<plist><null/></plist>').value).toBeNull();
  });
});
