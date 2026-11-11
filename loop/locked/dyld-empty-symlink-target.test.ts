import { describe, it, expect } from 'vitest';
import { resolveTreePath } from '../../../src/domain/apple/dyldPaths.js';
import type { DylibTreeEntry, DylibTreeView } from '../../../src/domain/apple/dylibResolution.js';

describe('dyld empty symlink targets', () => {
  it('does not treat an empty symlink target as its parent directory', async () => {
    const entries = new Map<string, DylibTreeEntry>([
      ['broken', { kind: 'symlink', target: '' }],
      ['library.dylib', { kind: 'file' }],
    ]);
    const view: DylibTreeView = {
      async entry(path) { return entries.get(path); },
      async image() { throw new Error('Image parsing is not needed for path resolution'); },
    };

    expect(await resolveTreePath(view, 'library.dylib')).toEqual({
      kind: 'file', path: 'library.dylib',
    });
    expect(await resolveTreePath(view, 'broken/library.dylib')).toEqual({ kind: 'absent' });
  });
});
