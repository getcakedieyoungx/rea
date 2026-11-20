import { describe, it, expect } from 'vitest';
import { redactCapturedTransportCredential } from '../../../src/process/ProviderDiagnosticRedaction.js';

describe('transport credential redaction in budget-cut output', () => {
  it('redacts a trailing partial token occurrence masked by an overlapping complete token at the cut', () => {
    // A self-overlapping credential: the suffix "abcd" is also its prefix.
    const token = 'abcdabcd';
    // Output was budget-cut after 24 retained bytes; 40 bytes were observed.
    const cut = {
      text: 'credential: abcdabcdabcd',
      bytes: 24,
      observedBytes: 40,
    };

    expect(
      redactCapturedTransportCredential(cut, token, '[REDACTED]'),
    ).toBe('credential: [REDACTED][REDACTED]');
  });

  it('keeps the non-overlapping residue when the complete output proves no further token', () => {
    const token = 'abcdabcd';
    // Complete output: the trailing "abcd" is provably not part of a token.
    const complete = {
      text: 'credential: abcdabcdabcd',
      bytes: 24,
      observedBytes: 24,
    };

    expect(
      redactCapturedTransportCredential(complete, token, '[REDACTED]'),
    ).toBe('credential: [REDACTED]abcd');
  });
});
