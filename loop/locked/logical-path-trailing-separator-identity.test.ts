import { describe, it, expect } from "vitest";

import {
  logicalPathEscapesRoot,
  normalizeJoinedLogicalPath,
} from "../../../src/domain/artifactIdentity.js";

describe("logical archive path normalization", () => {
  it("identifies a trailing separator as the same archive entry", () => {
    const withSeparator = normalizeJoinedLogicalPath("assets/img/");
    const withoutSeparator = normalizeJoinedLogicalPath("assets/img");

    // Currently "assets/img/" versus "assets/img": one entry, two identities.
    expect(withSeparator).toBe(withoutSeparator);
    expect(logicalPathEscapesRoot(withSeparator)).toBe(false);
  });

  it("still collapses interior dot and repeated separators", () => {
    expect(normalizeJoinedLogicalPath("assets/./img//icon.png")).toBe(
      "assets/img/icon.png",
    );
  });
});