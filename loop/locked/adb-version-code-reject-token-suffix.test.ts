import { describe, it, expect } from 'vitest';
import { parseDumpsysPackageOutput } from '../../../src/adb/AdbShellOutput.js';

describe('dumpsys versionCode token boundaries', () => {
  it('does not turn malformed version-code tokens into valid numeric prefixes', () => {
    for (const token of ['123oops', '12.5', '-7suffix', '0x10']) {
      const result = parseDumpsysPackageOutput(`  versionCode=${token}\n`);
      expect(result.versionCode, `invalid versionCode token: ${token}`).toBeNull();
    }
  });

  it('preserves complete integer tokens followed by dumpsys SDK annotations', () => {
    expect(
      parseDumpsysPackageOutput('  versionCode=123 minSdk=23 targetSdk=35\n').versionCode,
    ).toBe('123');
    expect(parseDumpsysPackageOutput('  versionCode=-7\n').versionCode).toBe('-7');
  });
});
