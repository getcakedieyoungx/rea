import { describe, it, expect } from 'vitest';
import { withoutEchoedPathHeader } from '../../../src/native/parsers/echoedPath.js';

// The echoed operand header is a line otool/dyld_info prints before a slice's
// body. When the header is the final line and carries no trailing newline
// (empty body), it is still the header and must be stripped, not leaked into
// the cleaned output. Current code requires `:\r?\n`, so both cases below
// return the input unchanged instead of ''.
describe('withoutEchoedPathHeader strips a terminal header without a trailing newline', () => {
  it('removes a bare `<path>:` header at end of input', () => {
    // Failing expectation today: returns '/bin/foo:' (unchanged), expected ''.
    expect(withoutEchoedPathHeader('/bin/foo:', '/bin/foo')).toBe('');
  });

  it('removes a `<path> (architecture <arch>):` header at end of input', () => {
    // Failing expectation today: returns the full input unchanged, expected ''.
    expect(
      withoutEchoedPathHeader('/bin/foo (architecture arm64):', '/bin/foo'),
    ).toBe('');
  });
});