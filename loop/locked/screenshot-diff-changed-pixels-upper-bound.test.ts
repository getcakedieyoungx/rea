import { describe, it, expect } from 'vitest';
import { webScreenshotDiffSchema } from '../../../src/domain/webScreenshot.js';

describe('screenshot difference pixel-count bounds', () => {
  const diff = {
    before: { width: 1, height: 1 },
    after: { width: 1, height: 1 },
    channel_threshold: 0,
    limitations: [],
    status: 'different',
    compared_pixels: 1,
    changed_pixels: 1,
    changed_ratio: 1,
    maximum_channel_delta: 255,
    mean_absolute_channel_delta: 255,
  };

  it('accepts a difference affecting the single compared pixel', () => {
    expect(webScreenshotDiffSchema.safeParse(diff).success).toBe(true);
  });

  it('rejects more changed pixels than were compared', () => {
    const result = webScreenshotDiffSchema.safeParse({
      ...diff,
      changed_pixels: 2,
    });
    expect(result.success).toBe(false);
  });
});
