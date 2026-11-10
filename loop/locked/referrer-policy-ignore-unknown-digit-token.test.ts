import { describe, it, expect } from 'vitest';
import { safeResponseMetadata } from '../../../src/browser/CdpSafeMetadata.js';

describe('Referrer-Policy forward-compatible token handling', () => {
  it('ignores an unknown token containing digits before a recognized policy', () => {
    const result = safeResponseMetadata(
      'request-referrer-digit-prefix',
      'https://example.test/page',
      { headers: { 'Referrer-Policy': 'future-policy2, origin' } },
      new Set(['https://example.test']),
    );

    expect(result.response.policies.referrer_policy).toBe('origin');
  });

  it('retains a recognized policy when an unknown digit-bearing token follows it', () => {
    const result = safeResponseMetadata(
      'request-referrer-digit-suffix',
      'https://example.test/page',
      { headers: { 'Referrer-Policy': 'no-referrer, future-policy2' } },
      new Set(['https://example.test']),
    );

    expect(result.response.policies.referrer_policy).toBe('no-referrer');
  });
});
