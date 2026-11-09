import { describe, it, expect } from 'vitest';
import { bufferedJsonParts } from '../../../src/domain/jsonSerialization.js';

describe('bufferedJsonParts preserves UTF-16 pairs across input parts', () => {
  it('does not corrupt a surrogate pair at the buffer flush boundary', () => {
    const prefix = 'a'.repeat(65535);
    const parts = [prefix + '\ud83d', '\ude00'];
    const buffered = [...bufferedJsonParts(parts)];
    expect(buffered.join('')).toBe(prefix + '😀');
    expect(
      Buffer.concat(buffered.map((part) => Buffer.from(part, 'utf8'))).toString('utf8'),
    ).toBe(prefix + '😀');
  });
});
