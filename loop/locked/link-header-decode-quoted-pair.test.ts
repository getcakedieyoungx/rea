import { describe, it, expect } from 'vitest';
import { safeResponseMetadata } from '../../../src/browser/CdpSafeMetadata.js';

describe('Link header quoted-pair decoding', () => {
  it('removes quoted-pair backslashes before interpreting a relation', () => {
    const origin = 'https://app.example.test';
    const captured = safeResponseMetadata(
      'request-quoted-pair',
      `${origin}/page`,
      { headers: { Link: String.raw`</next>; rel="ne\xt"` } },
      new Set([origin]),
    );

    expect(captured.response.links).toHaveLength(1);
    expect(captured.response.links[0]?.rel).toEqual(['next']);
  });

  it('keeps ordinary quoted relations unchanged', () => {
    const origin = 'https://app.example.test';
    const captured = safeResponseMetadata(
      'request-plain-relation',
      `${origin}/page`,
      { headers: { Link: '</next>; rel="next"' } },
      new Set([origin]),
    );

    expect(captured.response.links[0]?.rel).toEqual(['next']);
  });
});
