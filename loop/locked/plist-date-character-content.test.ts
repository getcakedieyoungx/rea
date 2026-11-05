import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('XML plist date character content', () => {
  it('joins text and CDATA before interpreting the date', () => {
    const parsed = parseXmlPropertyList(
      '<plist><date>2024-01-02T<![CDATA[03:04:05Z]]></date></plist>',
    );
    expect(parsed.value).toEqual(new Date('2024-01-02T03:04:05Z'));
  });

  it('ignores a leading XML comment rather than using it as the date', () => {
    const parsed = parseXmlPropertyList(
      '<plist><date><!-- timestamp -->2024-01-02T03:04:05Z</date></plist>',
    );
    expect(parsed.value).toEqual(new Date('2024-01-02T03:04:05Z'));
  });
});
