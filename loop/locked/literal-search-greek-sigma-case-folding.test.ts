import { describe, it, expect } from 'vitest';
import { analysisSearchPredicate } from '../../../src/domain/analysisSearch.js';

describe('case-insensitive literal search for Greek sigma', () => {
  it('matches final sigma and ordinary sigma as case variants of capital sigma', () => {
    const matches = analysisSearchPredicate({
      pattern: 'Σ',
      mode: 'literal',
      case_sensitive: false,
    });

    expect(matches('ς')).toBe(true);
    expect(matches('σ')).toBe(true);
    expect(matches('Σ')).toBe(true);
  });

  it('retains literal metacharacters and case-sensitive distinctions', () => {
    const literal = analysisSearchPredicate({
      pattern: 'Σ.',
      mode: 'literal',
      case_sensitive: false,
    });
    expect(literal('σx')).toBe(false);
    expect(literal('σ.')).toBe(true);

    const sensitive = analysisSearchPredicate({
      pattern: 'Σ',
      mode: 'literal',
      case_sensitive: true,
    });
    expect(sensitive('ς')).toBe(false);
    expect(sensitive('σ')).toBe(false);
    expect(sensitive('Σ')).toBe(true);
  });
});
