import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist integer comments are not character content', () => {
  it('joins integer text across comments without decoding comment text as digits', () => {
    const parsed = parseXmlPropertyList(
      '<plist><array><integer>4<!-- 999 -->2</integer><integer><!-- 999 -->-17</integer></array></plist>',
    );

    expect(parsed.value).toEqual([42, -17]);
    expect(parsed.numberLiterals.incomplete).toBe(false);
  });
});
