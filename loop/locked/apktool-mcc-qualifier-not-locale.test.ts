import { describe, it, expect } from 'vitest';
import {
  androidLocaleQualifierSchema,
  classifyAndroidStringsTable,
} from '../../../src/domain/apktool/apktoolResourceAnalysis.js';

describe('Android strings-table classification rejects the MCC carrier qualifier', () => {
  it('does not classify the mobile-country-code qualifier as a locale', () => {
    expect(classifyAndroidStringsTable('mcc')).toEqual({
      kind: 'other',
      suffix: 'mcc',
    });
  });

  it('refuses mcc as a selectable locale request', () => {
    expect(androidLocaleQualifierSchema.safeParse('mcc').success).toBe(false);
  });
});