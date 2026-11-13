import { describe, it, expect } from 'vitest';
import { resourceContentSize } from '../../../src/browser/CdpCaptureValues.js';

const invalid = { ok: false, error: { _tag: 'InvalidCdpResourceSize' } };

describe('CDP resource content size admission', () => {
  it('rejects a fractional byte count instead of admitting it as a size', () => {
    // Currently returns { ok: true, value: 1.5 }.
    expect(resourceContentSize(1.5)).toEqual(invalid);
    expect(resourceContentSize(0.5)).toEqual(invalid);
  });

  it('rejects a byte count beyond the exact integer range while keeping valid sizes', () => {
    // Currently returns { ok: true, value: 9007199254740994 }.
    expect(resourceContentSize(Number.MAX_SAFE_INTEGER + 2)).toEqual(invalid);
    expect(resourceContentSize(undefined)).toEqual({ ok: true, value: null });
    expect(resourceContentSize(0)).toEqual({ ok: true, value: 0 });
    expect(resourceContentSize(4096)).toEqual({ ok: true, value: 4096 });
  });
});