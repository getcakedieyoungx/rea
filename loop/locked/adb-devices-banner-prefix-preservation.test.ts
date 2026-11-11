import { describe, it, expect } from 'vitest';
import { parseAdbDevicesOutput } from '../../../src/adb/AdbDeviceOutput.js';

describe('ADB device-list banner recognition', () => {
  it('retains an unrecognized line that only starts with the banner text', () => {
    const diagnostic = 'List of devices attached: unexpected response';
    const result = parseAdbDevicesOutput(
      ['List of devices attached', diagnostic, 'emulator-5554 device transport_id:1', ''].join('\n'),
    );

    expect(result.unparsedLines).toEqual([diagnostic]);
    expect(result.devices.map((device) => device.serial)).toEqual(['emulator-5554']);
  });

  it('still ignores the exact banner with trailing whitespace and CRLF', () => {
    const result = parseAdbDevicesOutput('List of devices attached  \r\n\r\n');

    expect(result.unparsedLines).toEqual([]);
    expect(result.devices).toEqual([]);
  });
});
