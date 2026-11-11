import { describe, it, expect } from 'vitest';

import { parsePacketOutput } from '../../../src/captures/parsePacketOutput.js';
import { AnalysisOutputError } from '../../../src/domain/analysisErrorCore.js';

const SELECTED = ['frame.number'];

describe('parsePacketOutput frame-number admission', () => {
  it('reports a packet with no frame.number as a controlled output error', () => {
    const text = JSON.stringify([
      { _source: { layers: { 'frame.protocols': ['eth:ethertype:ip'] } } },
    ]);

    expect(() => parsePacketOutput(text, SELECTED)).toThrow(AnalysisOutputError);
  });

  it('reports a non-numeric frame.number as a controlled output error', () => {
    const text = JSON.stringify([
      { _source: { layers: { 'frame.number': ['1x'] } } },
    ]);

    expect(() => parsePacketOutput(text, SELECTED)).toThrow(AnalysisOutputError);
  });
});