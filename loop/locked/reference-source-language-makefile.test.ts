import { describe, it, expect } from 'vitest';
import { detectReferenceSourceLanguage } from '../../../src/domain/referenceSourceClassification.js';

describe('reference source language for extensionless build files', () => {
  it('names the Make language instead of reporting no language', () => {
    // The classifier in this same module already knows `makefile` as a
    // manifest name, and `Dockerfile` gets its own extensionless branch, so a
    // Makefile must not be the one manifest-shaped file with no language.
    // Currently returns null, which makes every language-gated caller skip it.
    expect(detectReferenceSourceLanguage('Makefile')).toBe('Makefile');
    expect(detectReferenceSourceLanguage('gnumakefile')).toBe('Makefile');
    expect(detectReferenceSourceLanguage('project/build/Makefile')).toBe(
      'Makefile',
    );
  });

  it('keeps the existing Dockerfile branch and unknown names unchanged', () => {
    expect(detectReferenceSourceLanguage('Dockerfile.dev')).toBe('Dockerfile');
    expect(detectReferenceSourceLanguage('src/index.ts')).toBe('TypeScript');
    expect(detectReferenceSourceLanguage('notes.unknownext')).toBe(null);
  });
});