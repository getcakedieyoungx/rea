import { describe, it, expect } from 'vitest';
import { safeResponseMetadata } from '../../../src/browser/CdpSafeMetadata.js';

describe('Link header extension relation identity', () => {
  it('preserves case-sensitive extension relation URIs while normalizing registered names', () => {
    const origin = 'https://app.example.test';
    const captured = safeResponseMetadata(
      'extension-relations',
      `${origin}/page`,
      {
        headers: {
          link: '</resource>; rel="NEXT https://relations.example/Review https://relations.example/review"',
        },
      },
      new Set([origin]),
    );

    expect(captured.response.links).toHaveLength(1);
    expect(captured.response.links[0]?.rel).toEqual([
      'next',
      'https://relations.example/Review',
      'https://relations.example/review',
    ]);
  });
});
