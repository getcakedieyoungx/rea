import { describe, it, expect } from 'vitest';
import { commitBrowserScenarioNormalization, normalizeScenarioValue } from '../../../src/domain/browserScenarioNormalization.js';
import type { BrowserScenarioNormalizationRule } from '../../../src/domain/browserScenarioDiffValues.js';

describe('browser scenario literal normalization order', () => {
  it('executes rules in canonical rule_id order rather than caller array order', () => {
    const rules: BrowserScenarioNormalizationRule[] = [
      { rule_id: '02-finish', artifacts: ['url'], match: 'intermediate', replacement: 'final' },
      { rule_id: '01-start', artifacts: ['url'], match: 'original', replacement: 'intermediate' },
    ];
    const committed = commitBrowserScenarioNormalization({ rules });
    expect(committed.rules.map((rule) => rule.rule_id)).toEqual(['01-start', '02-finish']);
    expect(normalizeScenarioValue('original', 'url', committed.rules)).toBe('final');
    expect(normalizeScenarioValue('original', 'url', rules)).toBe('final');
    expect(rules.map((rule) => rule.rule_id)).toEqual(['02-finish', '01-start']);
  });
});
