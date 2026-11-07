import { describe, it, expect } from 'vitest';
import { admitFirmwareVersion } from '../../../src/firmware/FirmwareVersion.js';

describe('Binwalk version core syntax', () => {
  it('does not admit zero-padded SemVer core components as compatible releases', () => {
    expect(admitFirmwareVersion('binwalk', 'binwalk 3.1.0').status).toBe('verified');
    for (const banner of ['binwalk 03.1.0', 'binwalk 3.01.0', 'binwalk 3.1.00']) {
      expect(admitFirmwareVersion('binwalk', banner).status, banner).toBe('unresolved');
    }
  });
});
