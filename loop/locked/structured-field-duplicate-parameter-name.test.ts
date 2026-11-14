import { describe, it, expect } from 'vitest';

import { structuredFieldToken } from '../../../src/browser/StructuredFieldToken.js';

describe('structuredFieldToken duplicate parameter names', () => {
  it('rejects an item whose parameter name repeats', () => {
    // RFC 9651 section 4.2.3 (parsing parameters, step 3) fails the parse when
    // `parameters` already holds a key character-wise equal to the new key. A
    // browser therefore ignores `cross-origin-opener-policy` /
    // `cross-origin-embedder-policy` spelled this way, so no policy is
    // enforced and no declared token may be reported.
    expect(
      structuredFieldToken('same-origin;report-to="a";report-to="b"'),
    ).toBeNull();
    // A bare key (implicit true) followed by the same key with a value is the
    // same repeat.
    expect(structuredFieldToken('require-corp;certificate;a;certificate')).toBeNull();
    expect(structuredFieldToken('same-origin;a=1;a=2')).toBeNull();
  });

  it('still accepts distinct parameter names on a valid item', () => {
    expect(structuredFieldToken('same-origin;report-to="endpoint"')).toBe(
      'same-origin',
    );
    expect(structuredFieldToken('require-corp;certificate;a=1')).toBe(
      'require-corp',
    );
    // Case matters: `a` and `A` are not both keys, because an uppercase letter
    // cannot start a key at all.
    expect(structuredFieldToken('same-origin;a;A')).toBeNull();
  });
});
