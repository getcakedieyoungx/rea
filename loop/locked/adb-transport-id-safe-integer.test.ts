import { describe, it, expect } from 'vitest';
import { parseAdbDevicesOutput } from '../../../src/adb/AdbDeviceOutput.js';

describe('ADB transport IDs retain exact numeric identity', () => {
  it('does not expose an unrepresentable transport ID as a rounded number', () => {
    const result = parseAdbDevicesOutput(
      'List of devices attached\nserial-1 device transport_id:9007199254740993\n',
    );
    expect(result.devices).toHaveLength(1);
    expect(result.devices[0]?.transport_id).toBe(null);
  });

  it('preserves a representable transport ID', () => {
    const result = parseAdbDevicesOutput(
      'List of devices attached\nserial-1 device transport_id:42\n',
    );
    expect(result.devices[0]?.transport_id).toBe(42);
  });
});
