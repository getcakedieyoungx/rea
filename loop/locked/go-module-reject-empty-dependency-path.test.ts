import { describe, it, expect } from 'vitest';

import { parseGoModuleText } from '../../../src/go/GoModuleText.js';

describe('parseGoModuleText dependency identity', () => {
  it('does not turn a dep record with an empty module path into a dependency', () => {
    // `dep\t\tv1.0.0` carries no module path. The same parser rejects an empty
    // path for `path`/`mod` records, and a dependency with an empty path is not
    // a module identity that any caller can reason about.
    const result = parseGoModuleText('dep\t\tv1.0.0\n');

    expect(result.dependencies).toEqual([]);
  });

  it('still parses a dependency that names its module path', () => {
    const result = parseGoModuleText('dep\tgithub.com/a/b\tv1.0.0\n');

    expect(result.dependencies).toEqual([
      { path: 'github.com/a/b', version: 'v1.0.0', sum: null, replacement: null },
    ]);
  });
});