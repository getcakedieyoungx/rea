import { describe, expect, it } from 'vitest';

import { parseDemangledSymbols } from '../../../src/native/parsers/demangle.js';

describe('swift-demangle empty output record', () => {
  it('rejects an empty output line instead of reporting an empty demangled symbol', () => {
    // Producer emitted exactly one record ("\n") for one requested symbol.
    // The trailing LF is record framing, so the record's text is empty and
    // cannot be the decoding of the requested non-empty symbol "main".
    expect(() => parseDemangledSymbols(['main'], '\n')).toThrow(TypeError);
  });

  it('does not report an unchanged symbol as demangled to an empty string', () => {
    // "alpha\n\n" carries two records: "alpha" and an empty one.
    expect(() => parseDemangledSymbols(['alpha', 'beta'], 'alpha\n\n')).toThrow(
      TypeError,
    );
  });
});