import { describe, it, expect } from 'vitest';

import { parseMcpResponseBudget } from '../../../src/config/mcpResponseBudget.js';

describe('parseMcpResponseBudget exactness', () => {
  it('rejects a decimal token that only becomes a safe integer after rounding', () => {
    // The constraint text promises a decimal safe integer. 9007199254740993 is
    // 2^53 + 1: JavaScript cannot represent it, and Number() rounds it down to
    // 9007199254740992 (2^53), which does pass isSafeInteger. The current
    // transform-then-validate order therefore admits a token whose value the
    // caller never spelled and silently shrinks the configured budget.
    expect(parseMcpResponseBudget('9007199254740993')).toMatchObject({
      ok: false,
    });
  });

  it('still admits exactly representable boundaries and rejects sub-floor values', () => {
    expect(parseMcpResponseBudget(undefined)).toStrictEqual({
      ok: true,
      value: undefined,
    });
    expect(parseMcpResponseBudget('10485760')).toStrictEqual({
      ok: true,
      value: 10485760,
    });
    expect(
      parseMcpResponseBudget(String(Number.MAX_SAFE_INTEGER)),
    ).toStrictEqual({ ok: true, value: Number.MAX_SAFE_INTEGER });
    expect(parseMcpResponseBudget('10485759')).toMatchObject({ ok: false });
    expect(parseMcpResponseBudget('010485760')).toMatchObject({ ok: false });
  });
});