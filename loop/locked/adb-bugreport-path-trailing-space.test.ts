import { describe, it, expect } from 'vitest';
import { parseBugreportCopiedPath } from '../../../src/adb/AdbShellOutput.js';

describe('parseBugreportCopiedPath preserves literal filename whitespace', () => {
  it('does not trim a trailing space belonging to the copied filename', () => {
    const path = '/reports/bugreport.zip ';
    expect(parseBugreportCopiedPath(`Bug report copied to ${path}\n`)).toBe(path);
  });

  it('removes CRLF framing without trimming the copied filename', () => {
    const path = '/reports/bugreport.zip ';
    expect(parseBugreportCopiedPath(`Bug report copied to ${path}\r\n`)).toBe(path);
  });
});
