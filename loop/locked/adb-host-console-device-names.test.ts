import { describe, it, expect } from 'vitest';
import { adbHostFileName } from '../../../src/adb/AdbHostFileName.js';

describe('ADB host filenames for Windows console devices', () => {
  it('rejects CONIN$ and CONOUT$ case-insensitively on Windows', () => {
    for (const name of ['CONIN$', 'CONOUT$', 'conin$', 'conout$']) {
      expect(adbHostFileName(`/sdcard/${name}`, 'win32')).toEqual({
        ok: false,
        reason: 'reserved_name',
      });
    }
  });

  it('preserves ordinary dollar names and POSIX console-like filenames', () => {
    expect(adbHostFileName('/sdcard/report$', 'win32')).toEqual({
      ok: true,
      fileName: 'report$',
    });
    expect(adbHostFileName('/sdcard/CONIN$', 'linux')).toEqual({
      ok: true,
      fileName: 'CONIN$',
    });
    expect(adbHostFileName('/sdcard/CONOUT$', 'linux')).toEqual({
      ok: true,
      fileName: 'CONOUT$',
    });
  });
});
