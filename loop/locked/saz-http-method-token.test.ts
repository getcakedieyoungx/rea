import { describe, it, expect } from 'vitest';
import { decodeSazHttp } from '../../../src/browser/history/SazHttp.js';

describe('SAZ HTTP request method token validation', () => {
  it('rejects a method containing an HTTP separator character', () => {
    // RFC 9110: method = token; parentheses are not tchar characters.
    const message = Buffer.from('G(ET / HTTP/1.1\r\nHost: example.test\r\n\r\n');
    expect(() => decodeSazHttp(message, true)).toThrow();
  });

  it('preserves valid extension methods rather than using a verb allowlist', () => {
    const message = Buffer.from('CUSTOM!METHOD / HTTP/1.1\r\nHost: example.test\r\n\r\n');
    expect(decodeSazHttp(message, true).method).toBe('CUSTOM!METHOD');
  });
});
