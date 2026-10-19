import { describe, it, expect } from 'vitest';

import { parseProcessListOutput } from '../../../src/adb/AdbShellOutput.js';

describe('ADB process PID precision', () => {
  it('retains an unrepresentable PID as unparsed evidence instead of rounding its identity', () => {
    const line = 'root 9007199254740993 1 1024 512 0 0 S example';
    const parsed = parseProcessListOutput(`${line}\n`);

    // Currently fails: a process with the rounded PID 9007199254740992 is emitted.
    expect(parsed.processes).toEqual([]);
    expect(parsed.unparsedLines).toEqual([line]);
  });

  it('still parses ordinary process identities and resource fields', () => {
    const parsed = parseProcessListOutput(
      'USER PID PPID VSZ RSS WCHAN ADDR S NAME\nroot 123 1 1024 512 0 0 S example\n',
    );

    expect(parsed.processes).toEqual([
      { user: 'root', pid: 123, ppid: 1, rss: 512, state: 'S', name: 'example' },
    ]);
    expect(parsed.unparsedLines).toEqual([]);
  });
});
