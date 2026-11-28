import { describe, it, expect } from 'vitest';

import { absenceClaimable } from '../../../src/domain/comparisonSemantics.js';

describe('absenceClaimable omitted_count reporting', () => {
  it('treats a reported zero or absent omission count as claimable', () => {
    expect(
      absenceClaimable({ status: 'complete', truncated: false, omitted_count: 0 }),
    ).toBe(true);
    expect(absenceClaimable({ status: 'complete', truncated: false })).toBe(
      true,
    );
  });

  it('refuses to claim absence when the omission count is unreported (null)', () => {
    // `null` is the schema's "no count was reported" value; only a reported
    // zero (or an absent field) supports claiming that nothing was omitted.
    expect(
      absenceClaimable({
        status: 'complete',
        truncated: false,
        omitted_count: null,
      }),
    ).toBe(false);
  });
});