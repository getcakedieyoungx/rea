import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist integer XML character content', () => {
  it('combines text and CDATA before interpreting an integer literal', () => {
    const parsed = parseXmlPropertyList(
      '<plist><array><integer>4<![CDATA[2]]></integer><integer><![CDATA[-]]>17</integer></array></plist>',
    );

    expect(parsed.value).toEqual([42, -17]);
    expect(parsed.numberLiterals.incomplete).toBe(false);
  });
});
