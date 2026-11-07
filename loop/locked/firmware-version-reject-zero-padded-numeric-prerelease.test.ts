import { describe, it, expect } from 'vitest';
import { admitFirmwareVersion } from '../../../src/firmware/FirmwareVersion.js';

describe('Binwalk numeric prerelease identifiers', () => {
  it('rejects leading zeros in purely numeric SemVer prerelease identifiers', () => {
    expect(admitFirmwareVersion('binwalk', 'binwalk 3.1.0-01').status).toBe('unresolved');
    expect(admitFirmwareVersion('binwalk', 'binwalk 3.1.0-rc.01').status).toBe('unresolved');
  });

  it('allows zero, alphanumeric identifiers, and zero-padded build metadata', () => {
    for (const version of ['3.1.0-0', '3.1.0-rc.0', '3.1.0-01a', '3.1.0+01']) {
      expect(admitFirmwareVersion('binwalk', `binwalk ${version}`)).toMatchObject({
        status: 'compatible',
        version,
      });
    }
  });
});
