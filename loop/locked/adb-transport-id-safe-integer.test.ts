import { describe, it, expect } from 'vitest';
import { parseAdbDevicesOutput } from '../../../src/adb/AdbDeviceOutput.js';

describe('ADB transport IDs retain exact numeric identity', () => {
  it('reports an unrepresentable transport ID as unknown instead of rounding it', () => {
    const { devices } = parseAdbDevicesOutput(
      'serial-1 device transport_id:9007199254740993\n',
    );

    expect(devices).toHaveLength(1);
    expect(devices[0]?.transport_id).toBeNull();
  });

  it('preserves transport IDs at the safe integer boundary', () => {
    const { devices } = parseAdbDevicesOutput(
      'serial-1 device transport_id:9007199254740991\n',
    );

    expect(devices).toHaveLength(1);
    expect(devices[0]?.transport_id).toBe(Number.MAX_SAFE_INTEGER);
  });
});
