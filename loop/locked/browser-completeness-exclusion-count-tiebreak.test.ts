import { describe, it, expect } from 'vitest';

import {
  classifyBrowserCompleteness,
  type BrowserExclusion,
  type BrowserSection,
} from '../../../src/domain/browserCompleteness.js';

const capture = (excluded: readonly BrowserExclusion[]) => ({
  policyFilteredSections: new Set<BrowserSection>(),
  attachLimitedSections: new Set<BrowserSection>(),
  truncatedSections: new Set<BrowserSection>(),
  unavailableSections: new Set<BrowserSection>(),
  excluded,
  droppedEvents: {
    scripts: 0,
    network_requests: 0,
    console_events: 0,
    websocket_connections: 0,
    websocket_frames: 0,
    webmcp_tools: 0,
    timeline_events: 0,
  },
});

const exclusion = (count: number | null): BrowserExclusion => ({
  section: 'scripts',
  reason: 'not_approved',
  count,
});

describe('browser completeness exclusion ordering', () => {
  it('orders equal section+reason exclusions by count, independent of input order', () => {
    const ascending = classifyBrowserCompleteness(
      capture([exclusion(1), exclusion(7), exclusion(null)]),
    );
    const descending = classifyBrowserCompleteness(
      capture([exclusion(null), exclusion(7), exclusion(1)]),
    );

    // Failing today: `canonicalExclusions` compares only section and reason, so
    // its comparator returns 0 here and the stable sort keeps caller order.
    expect(descending.excluded).toEqual(ascending.excluded);
    expect(ascending.excluded.map(({ count }) => count)).toEqual([
      1,
      7,
      null,
    ]);
  });
});