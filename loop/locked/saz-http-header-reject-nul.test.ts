import { describe, it, expect } from 'vitest';
import { decodeSazHttp } from '../../../src/browser/history/SazHttp.js';
import { CaptureFormatError } from '../../../src/browser/history/CaptureFormatError.js';

describe('SAZ HTTP header value validation', () => {
  it('rejects a NUL byte in a header value', () => {
    // NUL is forbidden in HTTP field values, even in stored capture messages.
    const message = Buffer.from('GET / HTTP/1.1\r\nX-Test: before\u0000after\r\n\r\n');
    expect(() => decodeSazHttp(message, true)).toThrow(CaptureFormatError);
  });

  it('preserves permitted header tabs and arbitrary binary body bytes', () => {
    const body = Buffer.from([0, 255, 13, 10]);
    const message = Buffer.concat([
      Buffer.from('HTTP/1.1 200 OK\r\nX-Test: before\tafter\r\n\r\n'),
      body,
    ]);
    const decoded = decodeSazHttp(message, false);
    expect(decoded.headers).toEqual([{ name: 'X-Test', value: ' before\tafter' }]);
    expect(decoded.body).toEqual(body);
  });
});
