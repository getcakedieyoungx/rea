import { describe, it, expect } from 'vitest';
import { parseWmSizeOutput } from '../../../src/adb/AdbShellOutput.js';

describe('parseWmSizeOutput finite dimensions', () => {
  it('rejects an overflowing physical width without losing a valid override', () => {
    const overflow = '9'.repeat(400);
    const result = parseWmSizeOutput(
      `Physical size: ${overflow}x1920\nOverride size: 720x1280\n`,
    );
    expect(result.physical).toBeNull();
    expect(result.override).toEqual({ width: 720, height: 1280 });
  });

  it('rejects an overflowing override height without losing valid physical dimensions', () => {
    const overflow = '9'.repeat(400);
    const result = parseWmSizeOutput(
      `Physical size: 1080x1920\nOverride size: 720x${overflow}\n`,
    );
    expect(result.physical).toEqual({ width: 1080, height: 1920 });
    expect(result.override).toBeNull();
  });
});
