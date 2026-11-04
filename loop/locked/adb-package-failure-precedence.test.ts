import { describe, it, expect } from 'vitest';
import { parsePackageChangeOutput } from '../../../src/adb/AdbShellOutput.js';

describe('ADB package-change failure precedence', () => {
  it('preserves an unambiguous success verdict', () => {
    expect(parsePackageChangeOutput('Performing Streamed Install\nSuccess\n')).toEqual({
      status: 'success',
      reason: null,
    });
  });

  it('does not let a Success line hide an explicit device failure', () => {
    for (const output of [
      'Success\nFailure [INSTALL_FAILED_INSUFFICIENT_STORAGE]\n',
      'Failure [INSTALL_FAILED_INSUFFICIENT_STORAGE]\nSuccess\n',
    ]) {
      expect(parsePackageChangeOutput(output)).toEqual({
        status: 'failure',
        reason: 'INSTALL_FAILED_INSUFFICIENT_STORAGE',
      });
    }
  });
});
