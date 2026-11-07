import { describe, it, expect } from 'vitest';
import { admitFirmwareVersion } from '../../../src/firmware/FirmwareVersion.js';

describe('firmware versions with prerelease and build metadata', () => {
  it('accepts both SemVer suffixes together on the supported Binwalk release line', () => {
    expect(admitFirmwareVersion('binwalk', 'binwalk 3.1.0-rc.1+build.7')).toMatchObject({
      status: 'compatible',
      version: '3.1.0-rc.1+build.7',
    });
  });

  it('does not admit an unsupported release line just because its suffix is valid', () => {
    expect(admitFirmwareVersion('binwalk', 'binwalk 4.0.0-rc.1+build.7')).toMatchObject({
      status: 'unsupported',
    });
  });
});
