import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist dates must not silently normalize impossible calendar days', () => {
  it('rejects February 29 in a non-leap year and February 30 in a leap year', () => {
    // These strings produce finite JavaScript Dates by rolling into March.
    // Merely checking Date#getTime for NaN does not validate the source date.
    for (const timestamp of ['2023-02-29T12:00:00Z', '2024-02-30T12:00:00Z']) {
      expect(() =>
        parseXmlPropertyList(`<plist><date>${timestamp}</date></plist>`),
      ).toThrow(TypeError);
    }
  });

  it('preserves February 29 in a leap year', () => {
    expect(
      parseXmlPropertyList('<plist><date>2024-02-29T12:00:00Z</date></plist>').value,
    ).toEqual(new Date('2024-02-29T12:00:00Z'));
  });
});
