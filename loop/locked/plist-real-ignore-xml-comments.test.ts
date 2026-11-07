import { describe, it, expect } from 'vitest';
import { parseXmlPropertyList } from '../../../src/domain/propertyListKeys.js';

describe('plist real comments are not character content', () => {
  it('preserves non-finite real identity when comments split its spelling', () => {
    const parsed = parseXmlPropertyList(
      '<plist><real>+in<!-- not character data -->finity</real></plist>',
    );

    expect(parsed.value).toBe(Number.POSITIVE_INFINITY);
    expect(parsed.numberLiterals.reals.has(Number.POSITIVE_INFINITY)).toBe(true);
    expect(parsed.numberLiterals.incomplete).toBe(false);
  });

  it('keeps complete numeric metadata for a finite real with comments', () => {
    const parsed = parseXmlPropertyList(
      '<plist><real>1<!-- ignored -->.25</real></plist>',
    );

    expect(parsed.value).toBe(1.25);
    expect(parsed.numberLiterals.incomplete).toBe(false);
    expect(parsed.numberLiterals.reals.has(1.25)).toBe(true);
  });
});
