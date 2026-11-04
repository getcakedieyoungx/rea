import { describe, expect, it } from "vitest";

import { directoryOf, expandPrefix } from "../../../src/domain/apple/dyldPaths.js";
import { analysisTextPage } from "../../../src/domain/analysisView/analysisViewText.js";
import { absoluteCallerPath } from "../../../src/filesystem/callerPath.js";
import { nativeRuntimeConvention } from "../../../src/domain/nativeConvention.js";
import { addressCoordinate } from "../../../src/domain/native/addressCoordinate.js";
import { percentDecodeUrlPath, hasScheme, looksExternal } from "../../../src/domain/artifactPathSyntax.js";

describe("probe", () => {
  it("directoryOf", () => {
    console.log("directoryOf('/a')=", JSON.stringify(directoryOf("/a")));
    console.log("directoryOf('/a/b')=", JSON.stringify(directoryOf("/a/b")));
    console.log("expandPrefix root exec=", JSON.stringify(expandPrefix("@executable_path/lib", { ownerDirectory: "", executable: "/rea" })));
  });
  it("analysisTextPage negative offset", () => {
    console.log("negative=", JSON.stringify(analysisTextPage("abcdefghij", -4, 6)));
  });
  it("caller path", () => {
    console.log("dot=", JSON.stringify(absoluteCallerPath(".", { cwd: "/tmp/work", platform: "linux" })));
    console.log("empty=", JSON.stringify(absoluteCallerPath("", { cwd: "/tmp/work", platform: "linux" })));
    console.log("trailing=", JSON.stringify(absoluteCallerPath("a/./", { cwd: "/tmp/work", platform: "linux" })));
    console.log("dotdot=", JSON.stringify(absoluteCallerPath("../x", { cwd: "/tmp/work", platform: "linux" })));
  });
  it("misc", () => {
    console.log("win native=", nativeRuntimeConvention("C:\\app\\libflutter.so"));
    console.log("addr=", JSON.stringify(addressCoordinate("mod:0x1f")));
    console.log("decode=", JSON.stringify(percentDecodeUrlPath("/a%2Fb")));
    console.log("hasScheme drive=", hasScheme("C:/x"), looksExternal("C:/x"));
  });
});
