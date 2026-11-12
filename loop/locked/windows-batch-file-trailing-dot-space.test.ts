import { describe, it, expect } from 'vitest';
import { isWindowsBatchFile } from '../../../src/process/WindowsBatchCommand.js';

describe('Windows batch file recognition', () => {
  it('recognizes a batch file whose name ends with a trailing dot', () => {
    // Win32 strips trailing dots, so "run.bat." is executed as run.bat.
    expect(isWindowsBatchFile('C:\\tools\\run.bat.')).toBe(true);
    expect(isWindowsBatchFile('C:\\tools\\run.CMD.')).toBe(true);
  });

  it('recognizes a batch file whose name ends with a trailing space', () => {
    // Win32 also strips trailing spaces, so "run.cmd " is executed as run.cmd.
    expect(isWindowsBatchFile('C:\\tools\\run.cmd ')).toBe(true);
  });

  it('still rejects names that only contain a similar extension', () => {
    expect(isWindowsBatchFile('C:\\tools\\run.batx')).toBe(false);
    expect(isWindowsBatchFile('C:\\tools\\run.batx.')).toBe(false);
  });
});