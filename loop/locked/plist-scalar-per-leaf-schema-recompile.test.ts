import { describe, it, expect } from 'vitest';

import { projectPlistValue } from '../../../src/domain/apple/plistValue.js';

// The scalar branch of `project()` ends with
//   z.union([z.string(), z.number(), z.boolean(), z.null()]).parse(item)
// so a fresh schema is compiled for every scalar leaf. Building one Zod union
// costs roughly 70 microseconds, which is paid per value: 20_000 scalars take
// ~1.44 s and 25_000 take ~1.8 s, even though the whole operation is a type
// check. The adjacent object branch already uses plain `typeof` guards, and
// one module-level schema keeps the same accepted leaf set.
const scalarArray = (length: number): unknown[] =>
  Array.from({ length }, () => 0);

describe('plist scalar projection compiles its leaf validator once', () => {
  it('projects 25000 scalar leaves without compiling a schema per value', () => {
    const input = scalarArray(25_000);

    const startedAt = Date.now();
    const projected = projectPlistValue(input);
    const elapsedMs = Date.now() - startedAt;

    expect(projected.value).toHaveLength(25_000);
    expect(projected.nonFiniteRealCount).toBe(0);
    // RED today (~1.8 s); one compiled schema projects this array in a few ms.
    expect(elapsedMs).toBeLessThan(600);
  });

  it('keeps leaf identity and still rejects values JSON cannot carry', () => {
    expect(projectPlistValue([1, 'a', true, null, 2.5]).value).toEqual([
      1,
      'a',
      true,
      null,
      2.5,
    ]);
    expect(() => projectPlistValue([1, undefined])).toThrow();
    expect(() => projectPlistValue([1, 10n])).not.toThrow();
  });
});