import { describe, expect, it } from "vitest";

import {
  directoryOf,
  expandPrefix,
} from "../../../src/domain/apple/dyldPaths.js";

describe("dyld executable path expansion", () => {
  it("keeps the filesystem root as the directory of a root-level path", () => {
    // The directory of "/rea" is "/", not the empty string: dropping the root
    // separator turns the expansion of an absolute executable path relative.
    expect(directoryOf("/rea")).toBe("/");
    expect(directoryOf("/usr/bin/tool")).toBe("/usr/bin");
  });

  it("expands @executable_path against a root-level executable absolutely", () => {
    const expanded = expandPrefix("@executable_path/lib/libz.dylib", {
      ownerDirectory: "",
      executable: "/rea",
    });
    expect(expanded).toEqual({ scope: "target", path: "/lib/libz.dylib" });
  });
});