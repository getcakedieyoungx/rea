import { describe, it, expect } from 'vitest';

import type { JavaScriptSemanticGraph } from '../../../src/domain/javascript/javascriptSemanticGraph.js';
import type { JavaScriptSemanticGraphUnknown } from '../../../src/domain/javascript/javascriptSemanticGraphSchemas.js';
import { assessJavaScriptSemanticQuery } from '../../../src/domain/javascript/javascriptSemanticQueryAssessment.js';

// The assessment reads only coverage.status, coverage.truncated and
// limitations from the graph, so the fixture supplies exactly those fields.
const graph = (
  coverage: { status: 'complete' | 'partial' | 'unavailable'; truncated: boolean },
  limitations: readonly string[] = [],
): JavaScriptSemanticGraph =>
  ({ coverage, limitations }) as unknown as JavaScriptSemanticGraph;

const unknown = {} as JavaScriptSemanticGraphUnknown;

describe('semantic query status keeps unknown and truncated coverage partial', () => {
  it('does not report a matched seed as found while the graph is truncated', () => {
    const assessment = assessJavaScriptSemanticQuery({
      graph: graph({ status: 'complete', truncated: true }),
      totalSeeds: 1,
      expectedMatches: 0,
      hasExpectation: false,
      unknowns: [],
      candidateRelations: 0,
    });

    // Coverage already admits the traversal is bounded, so the status cannot
    // claim a resolved result. Currently "found".
    expect(assessment.coverage.status).toBe('partial');
    expect(assessment.status).toBe('partial');
  });

  it('does not report a matched seed as found while an unknown remains', () => {
    const assessment = assessJavaScriptSemanticQuery({
      graph: graph({ status: 'complete', truncated: false }),
      totalSeeds: 1,
      expectedMatches: 1,
      hasExpectation: true,
      unknowns: [unknown],
      candidateRelations: 0,
    });

    expect(assessment.coverage.status).toBe('partial');
    expect(assessment.status).toBe('partial');
  });

  it('keeps a resolved match with complete coverage as found', () => {
    const assessment = assessJavaScriptSemanticQuery({
      graph: graph({ status: 'complete', truncated: false }),
      totalSeeds: 1,
      expectedMatches: 1,
      hasExpectation: true,
      unknowns: [],
      candidateRelations: 0,
    });

    expect(assessment.status).toBe('found');
  });
});
