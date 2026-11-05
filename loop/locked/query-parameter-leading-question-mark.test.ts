import { describe, it, expect } from 'vitest';

import { parseUrlQueryParameterNames } from '../../../src/domain/recordedTransportUrl.js';

describe('parseUrlQueryParameterNames query delimiter handling', () => {
  it('strips the leading question mark that a recorded URL query carries', () => {
    // parseRecordedTransportUrl projects `query` from URL.search, which always
    // begins with "?"; splitting that text must not invent a "?name" parameter.
    expect([...parseUrlQueryParameterNames('?a=1&b=2')]).toEqual(['a', 'b']);
    expect([...parseUrlQueryParameterNames('?session=abc&session=def')]).toEqual(
      ['session', 'session'],
    );
  });

  it('preserves order, repeats, empty names and percent decoding for a bare query', () => {
    expect([...parseUrlQueryParameterNames('a=1&a=2&=x&')]).toEqual([
      'a',
      'a',
      '',
      '',
    ]);
    expect([...parseUrlQueryParameterNames('x%20y=1&')]).toEqual(['x y', '']);
  });
});