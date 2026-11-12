import { describe, expect, it } from "vitest";

import type {
  DylibTreeEntry,
  DylibTreeView,
} from "../../../src/domain/apple/dylibResolution.js";
import { resolveTreePath } from "../../../src/domain/apple/dyldPaths.js";

const treeView = (
  entries: Readonly<Record<string, DylibTreeEntry>>,
): DylibTreeView =>
  ({
    entry: async (path: string) => entries[path],
  }) as DylibTreeView;

describe("resolveTreePath trailing-slash directory requirement", () => {
  it("still resolves an existing regular file without a trailing slash", async () => {
    const view = treeView({
      Frameworks: { kind: "directory" },
      "Frameworks/libfoo.dylib": { kind: "file" },
    });

    await expect(resolveTreePath(view, "Frameworks/libfoo.dylib")).resolves.toEqual(
      { kind: "file", path: "Frameworks/libfoo.dylib" },
    );
  });

  it("reports an existing file reached through a trailing slash as not-file, not absent", async () => {
    const view = treeView({
      Frameworks: { kind: "directory" },
      "Frameworks/libfoo.dylib": { kind: "file" },
    });

    // The entry exists, so this is a type failure (ENOTDIR), not a missing path.
    await expect(
      resolveTreePath(view, "Frameworks/libfoo.dylib/"),
    ).resolves.toEqual({ kind: "not-file" });
  });
});