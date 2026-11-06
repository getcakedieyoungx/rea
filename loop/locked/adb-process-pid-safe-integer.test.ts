import { describe, it, expect } from 'vitest';
import { parseProcessListOutput } from '../../../src/adb/AdbShellOutput.js';

describe('ADB process PID precision', () => {
  const header = 'USER PID PPID VSZ RSS WCHAN ADDR S NAME';

  it('retains an unsafe PID row as unparsed instead of rounding its identity', () => {
    const row = 'shell 9007199254740993 1 2048 128 0 0 S com.example.app';
    const result = parseProcessListOutput(`${header}\n${row}\n`);

    expect(result.processes).toEqual([]);
    expect(result.unparsedLines).toEqual([row]);
    expect(result.columns).toBe(header);
  });

  it('continues to decode ordinary process rows', () => {
    const row = 'shell 1234 1 2048 128 0 0 S com.example.app';
    const result = parseProcessListOutput(`${header}\n${row}\n`);

    expect(result.processes).toEqual([
      {
        user: 'shell',
        pid: 1234,
        ppid: 1,
        rss: 128,
        state: 'S',
        name: 'com.example.app',
      },
    ]);
    expect(result.unparsedLines).toEqual([]);
  });
});
