import { describe, it, expect } from 'vitest';
import { decodeSazHttp } from '../../../src/browser/history/SazHttp.js';

describe('SAZ HTTP version component grammar', () => {
  it('rejects multi-digit HTTP version components in request and response start lines', () => {
    // RFC 9112: HTTP-version = HTTP-name "/" DIGIT "." DIGIT.
    for (const version of ['HTTP/12.1', 'HTTP/1.12']) {
      const request = Buffer.from(`GET / ${version}\r\n\r\n`);
      const response = Buffer.from(`${version} 200 OK\r\n\r\n`);
      expect(() => decodeSazHttp(request, true)).toThrow();
      expect(() => decodeSazHttp(response, false)).toThrow();
    }
  });

  it('preserves syntactically valid versions without a supported-version allowlist', () => {
    for (const version of ['HTTP/1.0', 'HTTP/1.1', 'HTTP/9.9']) {
      expect(decodeSazHttp(Buffer.from(`GET / ${version}\r\n\r\n`), true).http_version).toBe(version);
      expect(decodeSazHttp(Buffer.from(`${version} 200 OK\r\n\r\n`), false).http_version).toBe(version);
    }
  });
});
