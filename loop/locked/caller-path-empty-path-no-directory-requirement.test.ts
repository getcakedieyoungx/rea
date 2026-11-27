import { describe, it, expect } from "vitest";

import { absoluteCallerPath } from "../../../src/filesystem/callerPath.js";

describe("absoluteCallerPath directory requirement", () => {
  it("does not invent a directory requirement for an empty path", () => {
    // An empty argument names nothing, so it cannot carry the caller's
    // explicit trailing-slash directory requirement. Today this returns
    // "/work/", which asserts a directory selection the caller never wrote.
    expect(absoluteCallerPath("", { cwd: "/work", platform: "linux" })).toBe(
      "/work",
    );
    expect(
      absoluteCallerPath("", { cwd: "/work/a/b", platform: "darwin" }),
    ).toBe("/work/a/b");
  });

  it("still keeps the directory requirement the caller did spell", () => {
    expect(
      absoluteCallerPath("assets/", { cwd: "/work", platform: "linux" }),
    ).toBe("/work/assets/");
    expect(
      absoluteCallerPath("assets/.", { cwd: "/work", platform: "linux" }),
    ).toBe("/work/assets/");
  });
});