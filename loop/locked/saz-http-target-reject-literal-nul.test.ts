import { describe, it, expect } from 'vitest';
import { decodeSazHttp } from '../../../src/browser/history/SazHttp.js';

describe('SAZ HTTP request-target NUL validation', () => {
  it('rejects a literal NUL in the request-target', () => {
    const message = Buffer.from('GET /before\x00after HTTP/1.1\r\nHost: example.test\r\n\r\n');
    expect(() => decodeSazHttp(message, true)).toThrow();
  });

  it('preserves percent-encoded octets without decoding the request-target', () => {
    const message = Buffer.from('GET /before%00after HTTP/1.1\r\nHost: example.test\r\n\r\n');
    expect(decodeSazHttp(message, true).url).toBe('/before%00after');
  });
});
