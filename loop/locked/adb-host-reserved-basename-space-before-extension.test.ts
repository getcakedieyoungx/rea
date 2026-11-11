import { describe, it, expect } from 'vitest';
import { adbHostFileName } from '../../../src/adb/AdbHostFileName.js';

describe('Windows device basenames with spaces before an extension', () => {
  it('rejects reserved device names even when their basename ends in spaces', () => {
    expect(adbHostFileName('/sdcard/console .txt', 'win32')).toEqual({
      ok: true,
      fileName: 'console .txt',
    });
    for (const name of ['NUL .txt', 'CON .log', 'COM1 .bin', 'LPT1  .dat']) {
      expect(adbHostFileName(`/sdcard/${name}`, 'win32')).toEqual({
        ok: false,
        reason: 'reserved_name',
      });
    }
  });
});
