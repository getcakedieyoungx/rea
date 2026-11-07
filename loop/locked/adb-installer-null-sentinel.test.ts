import { describe, it, expect } from 'vitest';
import { parseDumpsysPackageOutput } from '../../../src/adb/AdbShellOutput.js';

describe('dumpsys package installer identity', () => {
  it('maps Android\'s null installer sentinel to an absent installer', () => {
    const output = '  installerPackageName=null\n';
    expect(parseDumpsysPackageOutput(output).installerPackageName).toBeNull();
  });

  it('preserves actual installer names, including names containing null', () => {
    const output = '  installerPackageName=com.null.store\n';
    expect(parseDumpsysPackageOutput(output).installerPackageName).toBe('com.null.store');
  });
});
