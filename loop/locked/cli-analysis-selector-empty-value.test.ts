import { describe, it, expect } from 'vitest';

import { resolveCliAnalysisSelector } from '../../../src/cli/analysisSelector.js';

describe('resolveCliAnalysisSelector empty selector', () => {
  it('rejects an empty named selector instead of returning it', () => {
    expect(() =>
      resolveCliAnalysisSelector(undefined, '', 'selector', 'get_binary_overview'),
    ).toThrow(/Supply a positional selector or --selector=<value>/u);
  });

  it('rejects a whitespace-only positional selector', () => {
    expect(() =>
      resolveCliAnalysisSelector('   ', undefined, 'selector', 'get_binary_overview'),
    ).toThrow(/Supply a positional selector or --selector=<value>/u);
  });
});