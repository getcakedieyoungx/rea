import { describe, it, expect } from 'vitest';

import { zipPackageFormatForPath } from '../../../src/domain/zipPackageFormat.js';

describe('zipPackageFormatForPath classifies Android App Bundles as ZIP archives', () => {
  it('classifies an .aab suffix as the zip family instead of unknown', () => {
    // An Android App Bundle is a ZIP archive with an .aab suffix, and the
    // Android docs in this repo state it is not a standalone APK.
    // Currently fails: the suffix table has no .aab entry, so this is undefined.
    expect(zipPackageFormatForPath('/tmp/release/app-release.aab')).toBe('zip');

    // Case folding applies to the whole suffix, as for every other family.
    expect(zipPackageFormatForPath('APP-RELEASE.AAB')).toBe('zip');
  });

  it('keeps the existing APK and intentionally-absent families unchanged', () => {
    // A bundle is not an APK: .apk must stay the APK family.
    expect(zipPackageFormatForPath('base.apk')).toBe('apk');
    // .har names HTTP Archive JSON as well, so it stays unclassified by suffix.
    expect(zipPackageFormatForPath('shared.har')).toBeUndefined();
  });
});