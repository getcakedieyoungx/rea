import { describe, it, expect } from 'vitest';
import { webSourceOffset } from '../../../src/domain/webSourcePosition.js';

describe('webSourceOffset with CRLF line terminators', () => {
  it('does not admit a column that lands inside the two-unit CRLF terminator', () => {
    const crlf = 'a\r\nb';
    expect(webSourceOffset(crlf, { line: 1, column: 0 })).toBe(0);
    expect(webSourceOffset(crlf, { line: 1, column: 1 })).toBe(1);
    // Line 1 text is "a": column 2 is one past the end of that line and must
    // be rejected, exactly as it is for the LF spelling below.
    expect(webSourceOffset(crlf, { line: 1, column: 2 })).toBeUndefined();
    expect(webSourceOffset(crlf, { line: 2, column: 0 })).toBe(3);

    const lf = 'a\nb';
    expect(webSourceOffset(lf, { line: 1, column: 1 })).toBe(1);
    expect(webSourceOffset(lf, { line: 1, column: 2 })).toBeUndefined();
    expect(webSourceOffset(lf, { line: 2, column: 0 })).toBe(2);
  });
});