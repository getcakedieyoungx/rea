import { describe, it, expect } from 'vitest';
import { admitFirmwareVersion } from '../../../src/firmware/FirmwareVersion.js';

describe('firmware version suffix identifier validation', () => {
  it('rejects a Binwalk prerelease containing an empty dot-separated identifier', () => {
    expect(admitFirmwareVersion('binwalk', 'binwalk 3.1.0-rc..1').status).toBe('unresolved');
    expect(admitFirmwareVersion('binwalk', 'binwalk 3.1.0-rc.1').status).toBe('compatible');
  });

  it('rejects Binwalk build metadata containing an empty dot-separated identifier', () => {
    expect(admitFirmwareVersion('binwalk', 'binwalk 3.1.0+build..7').status).toBe('unresolved');
    expect(admitFirmwareVersion('binwalk', 'binwalk 3.1.0+build.7').status).toBe('compatible');
  });
});
