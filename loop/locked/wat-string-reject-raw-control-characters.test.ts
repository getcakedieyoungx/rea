import { describe, it, expect } from 'vitest';
import { watString } from '../../../src/wasm/WabtString.js';

describe('WAT string control characters', () => {
  it('rejects literal ASCII control characters in a quoted string', () => {
    expect(() => watString('line\nbreak"', 0)).toThrow();
    for (const control of ['\0', '\t', '\r', '\u001f', '\u007f']) {
      expect(() => watString(`a${control}b"`, 0)).toThrow();
    }
  });

  it('still decodes control bytes expressed through legal WAT escapes', () => {
    expect(watString(String.raw`a\00\t\n\r\1f\7fb"`, 0).bytes).toEqual(
      Buffer.from([0x61, 0x00, 0x09, 0x0a, 0x0d, 0x1f, 0x7f, 0x62]),
    );
  });
});
