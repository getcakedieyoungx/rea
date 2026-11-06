import { describe, it, expect } from 'vitest';

import { parseResolveActivityOutput } from '../../../src/adb/AdbShellOutput.js';

describe('parseResolveActivityOutput terminal verdict', () => {
  it('does not promote earlier diagnostic text when the final line reports no activity', () => {
    const output = 'Warning: activity resolution produced no match\r\nNo activity found\r\n\r\n';
    expect(parseResolveActivityOutput(output)).toBeNull();
  });

  it('still returns a resolved component after diagnostic text', () => {
    const output = 'Warning: activity resolution diagnostic\ncom.example/.MainActivity\n\n';
    expect(parseResolveActivityOutput(output)).toBe('com.example/.MainActivity');
    expect(parseResolveActivityOutput('No activity found\n')).toBeNull();
  });
});
