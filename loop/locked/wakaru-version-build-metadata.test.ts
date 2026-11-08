import { describe, it, expect } from 'vitest';
import { admitWakaruVersion } from '../../../src/javascript/recovery/WakaruVersion.js';

describe('Wakaru SemVer build metadata admission', () => {
  it('accepts an in-range release with build metadata and preserves the observed version', () => {
    const version = '1.15.2+build.7';
    const admitted = admitWakaruVersion(`wakaru ${version}`);

    expect(admitted).toMatchObject({ status: 'compatible', version });
    if (admitted.status === 'compatible') {
      expect(admitted.limitation).toContain(version);
    }
  });

  it('still rejects noncanonical prefixes and out-of-range builds', () => {
    expect(admitWakaruVersion('wakaru v1.15.2+build.7').status).toBe('unsupported');
    expect(admitWakaruVersion('wakaru 2.0.0+build.7').status).toBe('unsupported');
  });
});
