import { describe, it, expect } from 'vitest';
import { parseCapinfosOutput } from '../../../src/pcap/PcapOutput.js';

describe('capinfos capture duration numeric bounds', () => {
  it('keeps an overflowing decimal duration unknown instead of returning Infinity', () => {
    const prefix = 'File type: pcap\nFile encapsulation: Ethernet\nNumber of packets: 1\n';
    const result = parseCapinfosOutput(
      `${prefix}Capture duration: ${'9'.repeat(400)} seconds\n`,
    );

    expect(result.captureDurationSeconds).toBeNull();
    expect(
      parseCapinfosOutput(`${prefix}Capture duration: 1.25 seconds\n`).captureDurationSeconds,
    ).toBe(1.25);
  });
});
