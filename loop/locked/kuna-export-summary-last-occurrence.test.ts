import { describe, it, expect } from 'vitest';

import { parseKunaExportSummary } from '../../../src/kuna/KunaProjectFiles.js';

describe('Kuna completed-export summary', () => {
  it('reads the final summary, not an earlier echoed mention of the same shape', () => {
    // Kuna echoes a function header and any decompiler error verbatim, so a
    // failed function's message can carry text that looks like the summary.
    // The completed export's summary is the last one it prints.
    const stdout = [
      '// Function: run @ 0x401000  (error: functions: 1 ok, 0 failed)',
      'functions: 12 ok, 3 failed',
      '',
    ].join('\n');

    // Current code returns { decompiled: 1, failed: 0 } from the echoed text.
    expect(parseKunaExportSummary(stdout)).toEqual({
      decompiled: 12,
      failed: 3,
    });
  });

  it('still reads a single completed summary line', () => {
    expect(parseKunaExportSummary('functions: 7 ok, 2 failed\n')).toEqual({
      decompiled: 7,
      failed: 2,
    });
    expect(parseKunaExportSummary('no summary here')).toBeUndefined();
  });
});