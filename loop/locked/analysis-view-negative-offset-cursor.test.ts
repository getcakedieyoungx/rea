import { describe, it, expect } from 'vitest';

import { pageViewCoverage } from '../../../src/domain/analysisView/analysisViewCoverage.js';

describe('analysis view page coverage cursor', () => {
  it('never reports a negative next_offset for a negative selected offset', () => {
    // A negative page offset is not a valid cursor; computing offset + examined
    // hands the caller a negative next_offset and claims more pages follow.
    const coverage = pageViewCoverage(-5, 2, 10);
    expect(coverage.next_offset).not.toBeLessThan(0);
    expect(coverage.exhausted).toBe(true);
  });

  it('still pages forward inside the collection', () => {
    expect(pageViewCoverage(0, 4, 10)).toMatchObject({
      status: 'page',
      examined: 4,
      total: 10,
      next_offset: 4,
      exhausted: false,
    });
    expect(pageViewCoverage(8, 2, 10)).toMatchObject({
      status: 'page',
      next_offset: null,
      exhausted: true,
    });
  });
});