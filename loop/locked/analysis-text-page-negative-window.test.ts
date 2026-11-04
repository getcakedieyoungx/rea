import { describe, expect, it } from "vitest";

import { analysisTextPage } from "../../../src/domain/analysisView/analysisViewText.js";

describe("analysisTextPage input window", () => {
  it("refuses a negative offset instead of slicing back from the end", () => {
    // Offsets are UTF-16 positions into the body. A negative offset names no
    // position, yet slice(-4, 2) silently returns text and a coverage record
    // that claims six examined units of a window that was never selected.
    const result = analysisTextPage("abcdefghij", -4, 6);
    expect(result.ok).toBe(false);
  });

  it("refuses a non-positive limit instead of returning an inverted window", () => {
    const result = analysisTextPage("abcdefghij", 0, -3);
    expect(result.ok).toBe(false);
  });
});