import { describe, it, expect } from 'vitest';
import { windowAnnotationText } from '../../../src/domain/signals/annotationTextWindow.js';

describe('annotation text windows with a zero line budget', () => {
  it('returns no text when zero lines are requested at the beginning', () => {
    const result = windowAnnotationText('first\nsecond\nthird', 0, 0);

    expect(result.annotations_text).toBe('');
    expect(result.output_window).toEqual({
      total_lines: 3,
      returned_lines: 0,
      has_more: true,
    });
  });

  it('does not leak the remaining suffix when zero lines are requested after an offset', () => {
    const result = windowAnnotationText('first\nsecond\nthird', 1, 0);

    expect(result.annotations_text).toBe('');
    expect(result.output_window).toEqual({
      total_lines: 3,
      returned_lines: 0,
      has_more: true,
    });
  });
});
