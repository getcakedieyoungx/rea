import { describe, expect, it } from "vitest";

import { artifactDecompressionBudgetBytes } from "../../../src/domain/artifactDecompressionBudget.js";
import { zipPackageFormatForPath, hasZipSignature } from "../../../src/domain/zipPackageFormat.js";
import { compactStringIdentityKey } from "../../../src/domain/compactStringIdentity.js";
import { compareUnicodeCodePoints } from "../../../src/domain/unicodeCodePointOrder.js";
import { inspectSolidityMetadata } from "../../../src/evm/SolidityMetadata.js";
import { parseGoModuleText } from "../../../src/go/GoModuleText.js";
import { normalizeJoinedLogicalPath, logicalPathEscapesRoot } from "../../../src/domain/artifactIdentity.js";
import { webSourceOffset } from "../../../src/domain/webSourcePosition.js";

describe("probe2", () => {
  it("budget", () => {
    console.log("NaN=", artifactDecompressionBudgetBytes(Number.NaN));
    console.log("Inf=", artifactDecompressionBudgetBytes(Number.POSITIVE_INFINITY));
    console.log("neg=", artifactDecompressionBudgetBytes(-5));
    console.log("frac=", artifactDecompressionBudgetBytes(1000.9));
  });
  it("zip format", () => {
    console.log("aab=", zipPackageFormatForPath("/x/app.aab"));
    console.log("msixbundle=", zipPackageFormatForPath("/x/app.msixbundle"));
    console.log("appxbundle=", zipPackageFormatForPath("/x/app.appxbundle"));
    console.log("upper=", zipPackageFormatForPath("/x/APP.IPA"));
    console.log("sig=", hasZipSignature(new Uint8Array([0x50, 0x4b, 0x05, 0x06])));
  });
  it("compact key", () => {
    console.log("short=", compactStringIdentityKey("abc"));
    console.log("prefix=", compactStringIdentityKey("value-sha256:abc"));
    console.log("empty=", compactStringIdentityKey(""));
  });
  it("compare", () => {
    console.log("astral=", compareUnicodeCodePoints("\u{1F600}", "\uFFFF"));
    console.log("eq=", compareUnicodeCodePoints("ab", "ab"));
    console.log("prefix=", compareUnicodeCodePoints("ab", "abc"));
  });
  it("solidity", () => {
    // CBOR map {"b": h''} => a1 61 62 40, then length 04
    const bytes = Uint8Array.from([0xa1, 0x61, 0x62, 0x40, 0x00, 0x04]);
    console.log("emptybytes=", JSON.stringify(inspectSolidityMetadata(bytes)));
    // CBOR map {"solc": 0x00 08 13 (bytes len3)}
    const solc = Uint8Array.from([0xa1, 0x64, 0x73, 0x6f, 0x6c, 0x63, 0x43, 0x00, 0x08, 0x13, 0x00, 0x0b]);
    console.log("solc=", JSON.stringify(inspectSolidityMetadata(solc)));
  });
  it("go module", () => {
    const text = "path\texample.com/m\nmod\texample.com/m\t(devel)\n";
    console.log("mod=", JSON.stringify(parseGoModuleText(text)));
    const noTrail = "path\texample.com/m\nmod\texample.com/m\t(devel)";
    console.log("notail=", JSON.stringify(parseGoModuleText(noTrail)));
    const ctrl = 'build\t-ldflags="x"\ndep\tfoo.com/a\tv1.0.0\th1:abc=\n';
    console.log("dep=", JSON.stringify(parseGoModuleText(ctrl)));
  });
  it("logical path", () => {
    console.log("norm=", JSON.stringify(normalizeJoinedLogicalPath("./a/../b")));
    console.log("empty=", JSON.stringify(normalizeJoinedLogicalPath("")));
    console.log("escape=", logicalPathEscapesRoot(normalizeJoinedLogicalPath("../x")));
    console.log("abs=", logicalPathEscapesRoot(normalizeJoinedLogicalPath("/etc/passwd")));
  });
  it("source offset", () => {
    console.log("crlf=", webSourceOffset("ab\r\ncd", { line: 2, column: 1 }));
    console.log("eof=", webSourceOffset("abc", { line: 1, column: 3 }));
    console.log("beyond=", webSourceOffset("abc", { line: 1, column: 4 }));
    console.log("line2=", webSourceOffset("abc", { line: 2, column: 0 }));
  });
});
