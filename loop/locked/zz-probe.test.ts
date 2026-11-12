import { describe, it, expect } from 'vitest';
import { resolveTreePath } from '../../../src/domain/apple/dyldPaths.js';
import type { DylibTreeEntry, DylibTreeView } from '../../../src/domain/apple/dylibResolution.js';

const viewOf = (entries: Map<string, DylibTreeEntry>): DylibTreeView => ({
  async entry(path) {
    return entries.get(path);
  },
  async image() {
    throw new Error('not needed');
  },
});

describe('probe', () => {
  it('trailing slash on a file', async () => {
    const view = viewOf(
      new Map<string, DylibTreeEntry>([
        ['library.dylib', { kind: 'file' }],
        ['dir', { kind: 'directory' }],
      ]),
    );
    console.log('file/', JSON.stringify(await resolveTreePath(view, 'library.dylib/')));
    console.log('file/.', JSON.stringify(await resolveTreePath(view, 'library.dylib/.')));
    console.log('dir/', JSON.stringify(await resolveTreePath(view, 'dir/')));
    console.log('file', JSON.stringify(await resolveTreePath(view, 'library.dylib')));
    console.log('file/./', JSON.stringify(await resolveTreePath(view, 'library.dylib/./')));
    expect(true).toBe(true);
  });
});
