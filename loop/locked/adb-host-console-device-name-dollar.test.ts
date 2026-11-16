import { describe, it, expect } from 'vitest';
import { adbHostFileName } from '../../../src/adb/AdbHostFileName.js';

describe('Windows console device names ending in $', () => {
  it('rejects CONIN$ and CONOUT$ as reserved device names', () => {
    // Failing expectation today: the reserved-basename pattern only covers
    // con/prn/aux/nul/com1-9/lpt1-9, so these return { ok: true }.
    for (const name of ['CONIN$', 'CONOUT$', 'conin$.txt', 'CONOUT$ .log']) {
      expect(adbHostFileName(`/sdcard/${name}`, 'win32')).toEqual({
        ok: false,
        reason: 'reserved_name',
      });
    }
  });

  it('keeps names that merely start with a device prefix', () => {
    for (const name of ['console', 'CONIN', 'CONOUTS', 'conout.txt']) {
      expect(adbHostFileName(`/sdcard/${name}`, 'win32')).toEqual({
        ok: true,
        fileName: name,
      });
    }
  });
});