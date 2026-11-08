import { describe, it, expect } from 'vitest';
import { safeResponseMetadata } from '../../../src/browser/CdpSafeMetadata.js';

describe('Link header duplicate rel parameters', () => {
  it('ignores later rel occurrences as required by RFC 8288 section 3.3', () => {
    const origin = 'https://app.example.test';
    const captured = safeResponseMetadata(
      'request-duplicate-rel',
      `${origin}/page`,
      { headers: { Link: '</next>; rel="next"; REL="mcp"' } },
      new Set([origin]),
    );

    expect(captured.response.links).toHaveLength(1);
    expect(captured.response.links[0]?.rel).toEqual(['next']);
    expect(captured.agentHints).toEqual([]);
  });
});
