import { describe, it, expect } from 'vitest';
import { parseDumpsysPackageOutput } from '../../../src/adb/AdbShellOutput.js';

describe('ADB package user ID precision', () => {
  it('does not silently round an unsafe package user ID', () => {
    const result = parseDumpsysPackageOutput('  userId=9007199254740993\n');

    expect(result.userId).toBeNull();
  });

  it('preserves ordinary package user IDs, including zero', () => {
    expect(parseDumpsysPackageOutput('  userId=10123\n').userId).toBe(10123);
    expect(parseDumpsysPackageOutput('  userId=0\n').userId).toBe(0);
  });
});
