import { describe, it, expect } from 'vitest';
import { parsePackageChangeOutput } from '../../../src/adb/AdbShellOutput.js';

describe('ADB package change verdict precedence', () => {
  it('does not hide an explicit failure behind a Success line in either order', () => {
    const failure = 'Failure [INSTALL_FAILED_UPDATE_INCOMPATIBLE]';
    for (const output of [
      `Success\n${failure}\n`,
      `${failure}\nSuccess\n`,
    ]) {
      expect(parsePackageChangeOutput(output)).toEqual({
        status: 'failure',
        reason: 'INSTALL_FAILED_UPDATE_INCOMPATIBLE',
      });
    }
  });

  it('still accepts an unambiguous success with progress output', () => {
    expect(parsePackageChangeOutput('Performing Streamed Install\nSuccess\n')).toEqual({
      status: 'success',
      reason: null,
    });
  });
});
