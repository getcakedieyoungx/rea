import { describe, it, expect } from 'vitest';
import { parseWmDensityOutput } from '../../../src/adb/AdbShellOutput.js';

describe('ADB density parsing rejects numeric overflow', () => {
  it('does not expose Infinity as a physical, override, or legacy density', () => {
    const overflow = '9'.repeat(400);
    for (const output of [
      `Physical density: ${overflow}\n`,
      `Override density: ${overflow}\n`,
      `${overflow}\n`,
    ]) {
      expect(parseWmDensityOutput(output)).toEqual({
        physical: null,
        override: null,
      });
    }
  });

  it('still reads finite labeled and legacy densities', () => {
    expect(
      parseWmDensityOutput('Physical density: 420\nOverride density: 480\n'),
    ).toEqual({ physical: 420, override: 480 });
    expect(parseWmDensityOutput('420\n')).toEqual({
      physical: 420,
      override: null,
    });
  });
});
