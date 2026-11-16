import { describe, expect, it } from "vitest";

import { STABLE_IDENTIFIER_PATTERN } from "../../../src/domain/stringPatterns.js";

describe("stable evidence identifiers", () => {
  it("keeps multi-segment identifiers but rejects a dangling namespace or path separator", () => {
    // Separate segments stay admitted: namespace, path and ordinal forms.
    expect(STABLE_IDENTIFIER_PATTERN.test("metadata.TypeDef:12")).toBe(true);
    expect(STABLE_IDENTIFIER_PATTERN.test("src/app/main.js")).toBe(true);
    // A trailing separator names no segment at all.
    expect(STABLE_IDENTIFIER_PATTERN.test("build:")).toBe(false);
    expect(STABLE_IDENTIFIER_PATTERN.test("artifacts/")).toBe(false);
  });

  it("rejects an identifier that ends with a dot or hyphen", () => {
    expect(STABLE_IDENTIFIER_PATTERN.test("native-")).toBe(false);
    expect(STABLE_IDENTIFIER_PATTERN.test("module.")).toBe(false);
  });
});