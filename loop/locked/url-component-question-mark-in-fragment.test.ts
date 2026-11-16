import { describe, it, expect } from 'vitest';

import { urlDeclaresQueryOrFragment } from '../../../src/domain/urlComponents.js';

describe('urlDeclaresQueryOrFragment: "?" inside the fragment is not a query', () => {
  it('does not report a declared query when "?" appears only in the fragment', () => {
    // https://example.com/#a?b serializes to an empty `search` ("") and a
    // fragment of "a?b"; a "?" is a legal unescaped fragment character, so
    // the current `href.includes("?")` spelling misreports a query here.
    expect(urlDeclaresQueryOrFragment(new URL('https://example.com/#a?b'))).toBe(
      false,
    );
    expect(
      urlDeclaresQueryOrFragment(new URL('https://example.com/p#frag?x=1')),
    ).toBe(false);
    expect(urlDeclaresQueryOrFragment(new URL('https://example.com/#f?'))).toBe(
      false,
    );
  });

  it('still reports the components the URL really spells', () => {
    expect(urlDeclaresQueryOrFragment(new URL('https://example.com/?a=1'))).toBe(
      true,
    );
    expect(urlDeclaresQueryOrFragment(new URL('https://example.com/?'))).toBe(
      true,
    );
    expect(urlDeclaresQueryOrFragment(new URL('https://example.com/#f'))).toBe(
      true,
    );
    expect(urlDeclaresQueryOrFragment(new URL('https://example.com/?a=1#f'))).toBe(
      true,
    );
  });
});