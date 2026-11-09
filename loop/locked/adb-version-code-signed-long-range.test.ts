import { describe, it, expect } from 'vitest';
import { parseDumpsysPackageOutput } from '../../../src/adb/AdbShellOutput.js';

describe('dumpsys package signed 64-bit versionCode', () => {
  it('preserves both signed-long boundaries without numeric rounding', () => {
    for (const version of ['-9223372036854775808', '9223372036854775807']) {
      expect(
        parseDumpsysPackageOutput(`  versionCode=${version} minSdk=23\n`).versionCode,
      ).toBe(version);
    }
  });

  it('rejects version codes outside the signed-long range', () => {
    for (const version of ['9223372036854775808', '-9223372036854775809']) {
      expect(
        parseDumpsysPackageOutput(`  versionCode=${version} minSdk=23\n`).versionCode,
      ).toBeNull();
    }
  });
});
