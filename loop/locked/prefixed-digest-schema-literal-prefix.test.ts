import { describe, it, expect } from 'vitest';

import { prefixedDigestSchema } from '../../../src/domain/digests.js';

const HEX = 'a'.repeat(64);

/**
 * `prefixedDigestSchema(prefix)` documents its accepted shape as
 * `<prefix>_<64 lowercase hex>`: the prefix is literal text, and only the
 * digest part is a pattern. The current implementation interpolates the
 * prefix into `new RegExp(`^${prefix}_[a-f0-9]{64}$`)` without escaping it,
 * so the prefix is silently reinterpreted as a regular expression:
 *
 * - `prefixedDigestSchema('snapshot.v1')` matches `snapshotXv1_<hex>` because
 *   `.` matches any character — an identifier from a different family than
 *   the one the schema advertises. Failing expectation:
 *   `prefixedDigestSchema('snapshot.v1').safeParse('snapshotXv1_' + HEX).success`
 *   is currently `true` and must be `false`.
 * - `prefixedDigestSchema('a(b')` throws `SyntaxError` while the schema is
 *   being built instead of returning a `ZodString`. Failing expectation:
 *   `expect(() => prefixedDigestSchema('a(b')).not.toThrow()`.
 */
describe('prefixed digest identifier prefix', () => {
  it('treats the prefix as literal text instead of a regular expression', () => {
    expect(
      prefixedDigestSchema('snapshot.v1').safeParse(`snapshotXv1_${HEX}`).success,
    ).toBe(false);
    expect(
      prefixedDigestSchema('snapshot.v1').safeParse(`snapshot.v1_${HEX}`).success,
    ).toBe(true);
    expect(
      prefixedDigestSchema('artifact').safeParse(`artifact_${HEX}`).success,
    ).toBe(true);
  });

  it('builds a schema for a prefix containing regular-expression punctuation', () => {
    expect(() => prefixedDigestSchema('a(b')).not.toThrow();
    expect(prefixedDigestSchema('a(b').safeParse(`a(b_${HEX}`).success).toBe(true);
    expect(prefixedDigestSchema('a(b').safeParse(`aab_${HEX}`).success).toBe(false);
  });
});