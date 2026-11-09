import { describe, it, expect } from 'vitest';
import { resolveJavaScriptSourceMapReferences } from '../../../src/domain/javascript/javascriptSourceMapPaths.js';

describe('source-map reference filesystem identity', () => {
  it('rejects a URL whose decoded pathname contains NUL', () => {
    const references = resolveJavaScriptSourceMapReferences(
      ['https://example.test/src/a%00.ts'],
      null,
      'dist/app.js.map',
    );
    expect(references[0]?.resolution.kind).toBe('unresolved');
  });

  it('still resolves an ordinary URL pathname as a suffix', () => {
    const references = resolveJavaScriptSourceMapReferences(
      ['https://example.test/src/a%20b.ts'],
      null,
      'dist/app.js.map',
    );
    expect(references[0]?.resolution).toEqual({
      kind: 'suffix',
      path: 'example.test/src/a b.ts',
    });
  });
});
