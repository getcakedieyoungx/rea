import { describe, it, expect } from "vitest";

import { resolveCliJsonPaths } from "../../../src/cliJsonInput.js";

describe("resolveCliJsonPaths URL passthrough", () => {
  it("passes through an HTTPS URL with leading whitespace untouched", () => {
    const input = { input_path: " https://rea.invalid/evidence.json" };
    const resolved = resolveCliJsonPaths(input, [["input_path"]]) as {
      input_path: unknown;
    };
    expect(resolved.input_path).toBe(" https://rea.invalid/evidence.json");
  });

  it("passes through a file URL with trailing whitespace untouched", () => {
    const input = { input_path: "file:///tmp/rea-input.json " };
    const resolved = resolveCliJsonPaths(input, [["input_path"]]) as {
      input_path: unknown;
    };
    expect(resolved.input_path).toBe("file:///tmp/rea-input.json ");
  });
});