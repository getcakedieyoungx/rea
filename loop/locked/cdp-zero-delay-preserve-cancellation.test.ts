import { describe, it, expect } from 'vitest';
import { delayWithCancellation } from '../../../src/browser/CdpCaptureValues.js';
import { AnalysisCancelledError } from '../../../src/domain/analysisErrorCore.js';

describe('CDP zero-duration delay cancellation', () => {
  it('rejects an already cancelled operation even when no waiting is needed', async () => {
    const controller = new AbortController();
    controller.abort();

    const pending = delayWithCancellation(
      0,
      'inspect_web_page',
      controller.signal,
    );

    await expect(pending).rejects.toBeInstanceOf(AnalysisCancelledError);
  });

  it('resolves a zero-duration delay when the operation is not cancelled', async () => {
    const controller = new AbortController();

    await expect(
      delayWithCancellation(0, 'inspect_web_page', controller.signal),
    ).resolves.toBeUndefined();
  });
});