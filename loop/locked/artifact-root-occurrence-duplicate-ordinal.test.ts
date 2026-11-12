import { describe, it, expect } from 'vitest';

import { occurrenceIdForLocation } from '../../../src/domain/artifactIdentity.js';

type EntryKind = Parameters<typeof occurrenceIdForLocation>[0]['entryKind'];

const rootOccurrence = (duplicateOrdinal?: number): string =>
  occurrenceIdForLocation({
    rootArtifactId: 'art_root',
    logicalPath: '.',
    entryKind: 'file' as EntryKind,
    ...(duplicateOrdinal === undefined ? {} : { duplicateOrdinal }),
  });

describe('occurrenceIdForLocation root occurrence identity', () => {
  it('does not collapse distinct duplicate_ordinal values at the archive root', () => {
    // The non-root branch commits duplicate_ordinal into the digest, so two
    // distinct occurrences must never share an id. The "." branch currently
    // drops the argument and returns the same identity for both.
    expect(rootOccurrence(0)).not.toBe(rootOccurrence(1));
  });

  it('keeps the id stable for the same input and omits an absent ordinal', () => {
    expect(rootOccurrence()).toBe(rootOccurrence());
    expect(rootOccurrence(0)).toBe(rootOccurrence(0));
    expect(rootOccurrence()).not.toBe(rootOccurrence(0));
  });
});