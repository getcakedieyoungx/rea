import { describe, it, expect } from 'vitest';

import { decodeSazHttp } from '../../../src/browser/history/SazHttp.js';

/**
 * `decodeSazHttp` splits the header block on the separator it found ("\r\n"
 * only when a CRLF separator precedes any LF one, otherwise "\n"). A SAZ
 * message may legitimately mix them: CRLF header lines terminated by a plain
 * LF blank line leaves the "\r" of the last header line inside the start line,
 * so the request start-line grammar (`^(\S+) +(\S+) +HTTP\/…$`) no longer
 * matches and a valid recorded request is rejected as malformed. On the
 * response side the stray CR silently pollutes the reason phrase.
 */
describe('SAZ HTTP request/response line decoding', () => {
  it('accepts a CRLF start line terminated by an LF blank line', () => {
    const request = Buffer.from(
      'GET /api/v1/items HTTP/1.1\r\nHost: example.test\n\nrequest-body',
      'latin1',
    );

    expect(() => decodeSazHttp(request, true)).not.toThrow();
    expect(decodeSazHttp(request, true)).toMatchObject({
      method: 'GET',
      url: '/api/v1/items',
      http_version: 'HTTP/1.1',
      headers: [{ name: 'Host', value: 'example.test' }],
    });
    expect(decodeSazHttp(request, true).body.toString('latin1')).toBe(
      'request-body',
    );
  });

  it('keeps the response reason phrase free of a trailing carriage return', () => {
    const response = Buffer.from(
      'HTTP/1.1 204 No Content\r\nX-Trace: abc\n\n',
      'latin1',
    );

    expect(decodeSazHttp(response, false)).toMatchObject({
      http_version: 'HTTP/1.1',
      status: '204',
      reason: 'No Content',
      headers: [{ name: 'X-Trace', value: 'abc' }],
    });
  });
});