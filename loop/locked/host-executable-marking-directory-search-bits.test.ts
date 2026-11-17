import { describe, expect, it } from "vitest";

import { hostExecutableMarking } from "../../../src/artifacts/hostExecutableMarking.js";

type EntryMetadata = Parameters<typeof hostExecutableMarking>[1];

const directoryMetadata = (mode: number): EntryMetadata => ({
  mode,
  isFile: () => false,
});

const fileMetadata = (mode: number): EntryMetadata => ({
  mode,
  isFile: () => true,
});

describe("host executable marking", () => {
  it("does not read a directory's search bits as an executable file marking", () => {
    // 0o755 is the default mode of every directory, and its x bits grant
    // search permission on a container, not an executable marking on a file.
    for (const platform of ["linux", "darwin"] as const) {
      expect(
        hostExecutableMarking("/tmp/build", directoryMetadata(0o755), platform),
        platform,
      ).toBe(false);
      expect(
        hostExecutableMarking("/tmp/objects", directoryMetadata(0o777), platform),
        platform,
      ).toBe(false);
    }
  });

  it("still reports an executable regular file on POSIX hosts", () => {
    expect(hostExecutableMarking("/tmp/run", fileMetadata(0o755), "linux")).toBe(
      true,
    );
    expect(hostExecutableMarking("/tmp/readme", fileMetadata(0o644), "linux")).toBe(
      false,
    );
  });
});