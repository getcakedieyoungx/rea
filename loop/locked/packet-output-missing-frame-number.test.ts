import { describe, expect, it } from "vitest";

import { parsePacketOutput } from "../../../src/captures/parsePacketOutput.js";
import { AnalysisOutputError } from "../../../src/domain/analysisErrorCore.js";

describe("packet output frame identity", () => {
  it("reports a packet without frame.number as an analysis output failure", () => {
    const text = JSON.stringify([
      { _source: { layers: { "ip.src": ["10.0.0.1"] } } },
    ]);
    expect(() => parsePacketOutput(text, ["ip.src"])).toThrow(
      AnalysisOutputError,
    );
  });

  it("reports an empty frame.number list as an analysis output failure", () => {
    const text = JSON.stringify([
      { _source: { layers: { "frame.number": [], "ip.src": ["10.0.0.1"] } } },
    ]);
    expect(() => parsePacketOutput(text, ["ip.src"])).toThrow(
      AnalysisOutputError,
    );
  });
});