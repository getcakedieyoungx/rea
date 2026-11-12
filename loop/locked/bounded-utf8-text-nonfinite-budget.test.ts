import { describe, it, expect } from 'vitest';

import { boundedUtf8Text } from '../../../src/process/boundedUtf8Text.js';

describe('boundedUtf8Text budget admission', () => {
  it('does not return the whole text when the byte budget is not a finite number', () => {
    // NaN makes every `bytes + codePointBytes > maximumBytes` comparison false,
    // so the current implementation copies the entire input and reports
    // `truncated: false` — the budget is silently not applied at all.
    expect(boundedUtf8Text('abc', Number.NaN)).toEqual({
      text: '',
      truncated: true,
    });
    expect(boundedUtf8Text('abc', Number.POSITIVE_INFINITY)).toEqual({
      text: 'abc',
      truncated: false,
    });
  });

  it('still cuts on a code point boundary for an ordinary budget', () => {
    // "é" is two UTF-8 bytes; a one-byte budget must not split it.
    expect(boundedUtf8Text('aé', 1)).toEqual({ text: 'a', truncated: true });
    expect(boundedUtf8Text('aé', 3)).toEqual({ text: 'aé', truncated: false });
  });
});