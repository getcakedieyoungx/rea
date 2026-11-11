import { describe, it, expect } from 'vitest';

import { matchesOwnedProcessCommand } from '../../../src/process/ProcessCommandIdentity.js';

describe('matchesOwnedProcessCommand darwin argument comparison', () => {
  it('rejects a process that shares the executable name but runs different arguments', () => {
    // macOS `ps -o command` prints an owned executable as `(myapp)`; matching on
    // the basename alone must not accept a different argv as the same process.
    expect(
      matchesOwnedProcessCommand('(myapp) --inject', 'myapp --expected', 'darwin'),
    ).toBe(false);
    expect(
      matchesOwnedProcessCommand(
        '/usr/bin/worker --steal',
        '/opt/app/worker --serve',
        'darwin',
      ),
    ).toBe(false);
  });

  it('still normalizes the darwin executable path when the arguments agree', () => {
    expect(
      matchesOwnedProcessCommand('(myapp) --expected', 'myapp --expected', 'darwin'),
    ).toBe(true);
    expect(
      matchesOwnedProcessCommand(
        '/Applications/My.app/Contents/MacOS/worker --serve',
        '/opt/app/worker --serve',
        'darwin',
      ),
    ).toBe(true);
  });
});