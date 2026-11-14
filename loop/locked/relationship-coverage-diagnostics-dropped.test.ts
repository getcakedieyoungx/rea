import { describe, it, expect } from 'vitest';

import { relationshipCoverageLimitations } from '../../../src/domain/relationshipCoverage.js';

describe('relationship coverage diagnostics reach the caller', () => {
  it('returns the diagnostics a complete provider reported', () => {
    // A provider that declares complete coverage can still report a caveat it
    // observed (for example an unreadable table). The schema accepts
    // `diagnostics`, so dropping them loses provider-supplied evidence.
    const limitations = relationshipCoverageLimitations({
      status: 'complete',
      diagnostics: ['provider skipped import-address-table entries'],
    });

    expect(limitations).toEqual([
      'provider skipped import-address-table entries',
    ]);
  });

  it('keeps partial limitations and the provider diagnostics together', () => {
    const limitations = relationshipCoverageLimitations({
      status: 'partial',
      limitations: ['callees truncated at the provider record limit'],
      diagnostics: ['provider skipped import-address-table entries'],
    });

    expect(limitations).toEqual([
      'callees truncated at the provider record limit',
      'provider skipped import-address-table entries',
    ]);
  });
});