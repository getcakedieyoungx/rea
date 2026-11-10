import { describe, it, expect } from 'vitest';
import { safeResponseMetadata } from '../../../src/browser/CdpSafeMetadata.js';

describe('Link media type parameter preservation', () => {
  it('preserves the case-sensitive multipart boundary in a type hint', () => {
    const captured = safeResponseMetadata(
      'boundary-case',
      'https://example.test/page',
      {
        headers: {
          Link: '</parts>; rel="alternate"; type="multipart/mixed; boundary=AaB03x"',
        },
      },
      new Set(['https://example.test']),
    );

    expect(captured.response.links).toHaveLength(1);
    expect(captured.response.links[0]?.type).toBe('multipart/mixed; boundary=AaB03x');
  });
});
