import { describe, it, expect } from 'vitest';

import { javaScriptWorkerMemoryLimitBytes } from '../../../src/process/JavaScriptWorkerMemoryLimit.js';

const MIB = 1024 * 1024;

/**
 * The owned Job Object limit is the only enforcement Bun gets on Windows, so a
 * heap budget that is not a finite positive number must not be turned into a
 * commit limit: `NaN` or `Infinity` bytes is not an enforcement, it is the
 * silent loss of one.
 */
const bunOnWindows = {
  platform: 'win32' as NodeJS.Platform,
  versions: { node: '22.19.0', bun: '1.4.2' },
};

describe('JavaScript worker owned memory limit input validation', () => {
  it('refuses a non-finite heap budget instead of emitting a NaN/Infinity commit limit', () => {
    expect(javaScriptWorkerMemoryLimitBytes(Number.NaN, bunOnWindows)).toBeNull();
    expect(
      javaScriptWorkerMemoryLimitBytes(Number.POSITIVE_INFINITY, bunOnWindows),
    ).toBeNull();
  });

  it('still derives the reserve-based limit for an ordinary budget', () => {
    expect(javaScriptWorkerMemoryLimitBytes(256, bunOnWindows)).toBe(
      256 * MIB + 512 * MIB,
    );
    expect(
      javaScriptWorkerMemoryLimitBytes(256, {
        platform: 'linux' as NodeJS.Platform,
        versions: { node: '22.19.0', bun: '1.4.2' },
      }),
    ).toBeNull();
  });
});