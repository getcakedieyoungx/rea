import { describe, it, expect } from 'vitest';
import { compositeKey } from '../../../src/domain/unicodeCodePointOrder.js';

describe('compositeKey distinguishes missing and null tuple values', () => {
  it('does not collapse an undefined component into an explicit null component', () => {
    expect(compositeKey(['entry', undefined])).not.toBe(
      compositeKey(['entry', null]),
    );
  });

  it('remains deterministic and distinguishes tuple boundaries', () => {
    expect(compositeKey(['entry', undefined])).toBe(
      compositeKey(['entry', undefined]),
    );
    expect(compositeKey(['a\0b', 'c'])).not.toBe(
      compositeKey(['a', 'b\0c']),
    );
  });
});
