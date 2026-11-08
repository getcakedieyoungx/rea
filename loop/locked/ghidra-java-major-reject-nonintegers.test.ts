import { describe, it, expect } from 'vitest';
import { ghidraJavaMajorAccepted } from '../../../src/ghidra/GhidraInstallationPolicy.js';

describe('Ghidra Java major version admission', () => {
  const requirement = {
    minimumMajor: 21,
    maximumMajor: null,
    unresolved: null,
  } as const;

  it('rejects infinity and fractional numbers as invalid Java major versions', () => {
    expect(ghidraJavaMajorAccepted(Infinity, requirement)).toBe(false);
    expect(ghidraJavaMajorAccepted(21.5, requirement)).toBe(false);
  });

  it('continues to accept integer majors within the declared range', () => {
    expect(ghidraJavaMajorAccepted(21, requirement)).toBe(true);
    expect(ghidraJavaMajorAccepted(22, requirement)).toBe(true);
    expect(ghidraJavaMajorAccepted(20, requirement)).toBe(false);
  });
});
