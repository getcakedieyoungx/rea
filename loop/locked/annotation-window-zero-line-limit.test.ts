import { describe, it, expect } from 'vitest';

import { windowAnnotationText } from '../../../src/domain/signals/annotationTextWindow.js';

/**
 * `windowAnnotationText` pages literal LF-separated display lines and reports
 * how many lines it returned. `limit` is the number of retained lines, so a
 * zero limit retains none of them. The window bounds, however, start as
 * `end = text.length` and are only narrowed inside the loop while
 * `returned < limit`; with `limit === 0` that branch never runs, so the slice
 * spans from the offset to the end of the producer text while
 * `output_window.returned_lines` reports 0 — the payload and the window
 * disagree about what was returned.
 */
describe('annotation text window with a zero line limit', () => {
  const text = 'alpha\nbeta\ngamma';

  it('returns an empty window instead of the remaining text', () => {
    expect(windowAnnotationText(text, 1, 0)).toEqual({
      annotations_text: '',
      output_window: { total_lines: 3, returned_lines: 0, has_more: true },
    });
  });

  it('keeps the window empty at the first line as well', () => {
    expect(windowAnnotationText(text, 0, 0).annotations_text).toBe('');
    expect(windowAnnotationText('only line', 0, 0).annotations_text).toBe('');
  });
});