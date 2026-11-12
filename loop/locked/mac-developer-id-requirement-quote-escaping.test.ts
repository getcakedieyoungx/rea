import { describe, it, expect } from 'vitest';

import { macDeveloperIdRequirement } from '../../../src/process/MacCodeSignature.js';

describe('macDeveloperIdRequirement quoting of interpolated identities', () => {
  it('escapes an embedded double quote in the sealed identifier', () => {
    // A requirement string is a quoted csreq blob: an unescaped `"` closes the
    // string early, so the emitted condition no longer names the given
    // identifier. csreq spells it `\"`.
    expect(macDeveloperIdRequirement('com.example."beta"', '2AMA2753NF')).toBe(
      '= identifier "com.example.\\"beta\\"" and anchor apple generic' +
        ' and certificate leaf[subject.OU] = "2AMA2753NF"',
    );
    expect(macDeveloperIdRequirement('com.example.app', 'TEAM"X')).toBe(
      '= identifier "com.example.app" and anchor apple generic' +
        ' and certificate leaf[subject.OU] = "TEAM\\"X"',
    );
  });

  it('escapes a backslash so it cannot start a bogus escape sequence', () => {
    expect(macDeveloperIdRequirement('com.example.a\\b', '2AMA2753NF')).toBe(
      '= identifier "com.example.a\\\\b" and anchor apple generic' +
        ' and certificate leaf[subject.OU] = "2AMA2753NF"',
    );
    expect(macDeveloperIdRequirement('com.example.app', '2AMA2753NF')).toBe(
      '= identifier "com.example.app" and anchor apple generic' +
        ' and certificate leaf[subject.OU] = "2AMA2753NF"',
    );
  });
});