import { describe, it, expect } from 'vitest';
import { parseFeatureListOutput } from '../../../src/adb/AdbShellOutput.js';

describe('ADB feature version precision', () => {
  it('preserves unsafe version declarations as unparsed instead of rounding them', () => {
    for (const version of ['9007199254740993', '0x20000000000001']) {
      const line = `feature:android.hardware.camera=${version}`;
      const result = parseFeatureListOutput(`${line}\n`);
      expect(result.features).toEqual([]);
      expect(result.unparsedLines).toEqual([line]);
    }
  });

  it('still parses ordinary decimal, hexadecimal, and unversioned features', () => {
    const result = parseFeatureListOutput(
      'feature:android.hardware.camera=2\nfeature:reqGlEsVersion=0x30002\nfeature:android.hardware.wifi\n',
    );
    expect(result).toEqual({
      features: [
        { name: 'android.hardware.camera', version: 2 },
        { name: 'reqGlEsVersion', version: 196610 },
        { name: 'android.hardware.wifi', version: null },
      ],
      unparsedLines: [],
    });
  });
});
