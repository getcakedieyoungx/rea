import { describe, it } from "vitest";

import { compareUnicodeCodePoints, compositeKey } from "../../../src/domain/unicodeCodePointOrder.js";
import { compactStringIdentityKey } from "../../../src/domain/compactStringIdentity.js";
import { inferJsonShape } from "../../../src/domain/jsonShape.js";
import { analysisTextPage } from "../../../src/domain/analysisView/analysisViewText.js";
import { pageViewCoverage } from "../../../src/domain/analysisView/analysisViewCoverage.js";
import { webSourceOffset } from "../../../src/domain/webSourcePosition.js";
import { addressCoordinate } from "../../../src/domain/native/addressCoordinate.js";
import { readPngHeaderDimensions } from "../../../src/domain/pngHeader.js";
import { decodePeMachine } from "../../../src/domain/peMachine.js";
import { isValidFridaRemoteAddress } from "../../../src/contracts/fridaRemoteAddress.js";
import { structuredFieldToken } from "../../../src/browser/StructuredFieldToken.js";
import { typescriptEmittedSourceCandidates } from "../../../src/application/TypeScriptEmittedSourceCandidates.js";
import { hostExecutableMarking } from "../../../src/artifacts/hostExecutableMarking.js";
import { matchesOwnedProcessCommand } from "../../../src/process/ProcessCommandIdentity.js";
import { parsePlistIntegerLiteral, parsePlistNonFiniteRealLiteral } from "../../../src/domain/apple/plistNumbers.js";
import { normalizeKunaAddress, compareKunaAddresses } from "../../../src/kuna/KunaAddress.js";
import { kunaAddressFromJsonNumber } from "../../../src/kuna/KunaJson.js";
import { isPathWithinRoot } from "../../../src/domain/localPath.js";
import { cdpSnapshotValueString, cdpSnapshotString } from "../../../src/browser/CdpSnapshotStrings.js";
import { isRelativeJavaScriptModuleSpecifier } from "../../../src/domain/javascript/javascriptModuleSpecifier.js";
import { machoCpuSubtypeBase } from "../../../src/domain/apple/machoCpuIdentity.js";
import { decodeXmlText } from "../../../src/domain/propertyListKeys.js";
import { canonicalString } from "../../../src/domain/comparisonSemantics.js";

const show = (label: string, value: unknown) =>
  console.log(label, "=>", JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? String(v) : v)));

describe("probe", () => {
  it("probes", () => {
    show("cmp a vs a", compareUnicodeCodePoints("a", "a"));
    show("cmp \\uffff vs astral", compareUnicodeCodePoints("\uffff", "\u{10000}"));
    show("cmp astral vs \\uffff", compareUnicodeCodePoints("\u{10000}", "\uffff"));
    show("compositeKey", compositeKey(["a", 1]));
    show("compact short", compactStringIdentityKey("a"));
    show("compact long", compactStringIdentityKey("x".repeat(200)).slice(0, 12));
    show("shape", inferJsonShape('{"a":[1,2],"b":{}}'));
    show("shape bad", inferJsonShape("{"));
    show("text page", analysisTextPage("abcdef", 2, 3));
    show("text page empty", analysisTextPage("", 0, 10));
    show("coverage beyond", pageViewCoverage(5, 0, 3));
    show("webpos", webSourceOffset("a\r\nb", { line: 1, column: 1 }));
    show("webpos2", webSourceOffset("a\u2028b", { line: 2, column: 0 }));
    show("addr", addressCoordinate("mem:0x10"));
    show("addr weird", addressCoordinate("a:0x10:0x20"));
    show("addr lone", addressCoordinate(":0x10"));
    const png = Buffer.alloc(24);
    png.writeUInt32BE(13, 8);
    png.write("IHDR", 12, "latin1");
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, 0);
    png.writeUInt32BE(100, 16);
    png.writeUInt32BE(50, 20);
    show("png", readPngHeaderDimensions(png));
    show("pe 0xfd1d", decodePeMachine(0xfd1d));
    show("pe arm64 linux", decodePeMachine(0xaa64 ^ 0x7b79));
    for (const v of ["a", "a:1", "a:0", "a:65536", "a:01", "[::1]:1234", "a:b", "a:1x", "1.2.3.4:8080", "h:999999999999999999999", ""])
      show(`frida ${v}`, isValidFridaRemoteAddress(v));
    for (const v of ["abc", " abc ", "abc; a=1", "abc;a", "abc;A=1", "abc;a=:AAA=:", "abc;a=%c3", "abc;a=\"x\"", "abc;a=1,def"])
      show(`sf ${v}`, structuredFieldToken(v));
    show("tscand", typescriptEmittedSourceCandidates("src/a.ts", "a.js"));
    show("tscand dotfile", typescriptEmittedSourceCandidates("src/a.ts", ".js"));
    show("tscand dts", typescriptEmittedSourceCandidates("src/a.ts", "a.d.ts"));
    show("hostexec", hostExecutableMarking("a.exe", { isFile: () => true, mode: 0o644 } as never, "win32"));
    show("proc", matchesOwnedProcessCommand("(foo) -x", "foo -x", "darwin"));
    show("proc2", matchesOwnedProcessCommand("foobar", "foo", "linux"));
    for (const v of ["-0x10", "+0x10", "007", " 12 ", "0x", "12 ", "0b10", "--1", "-"])
      show(`plistint ${JSON.stringify(v)}`, parsePlistIntegerLiteral(v));
    for (const v of ["nan", "NAN", "+INF", "-infinity", "Infinity", " inf "])
      show(`plistreal ${v}`, String(parsePlistNonFiniteRealLiteral(v)));
    for (const v of ["0x0", "0X0f", "0x0000000000000000f", "0x1f", "0xffffffffffffffff", "0x00000000000000000", "0x", 1, "0xABC"])
      show(`kuna ${JSON.stringify(v)}`, normalizeKunaAddress(v));
    show("kuna cmp", [compareKunaAddresses("0x9", "0xa"), compareKunaAddresses("0xa", "0x9")]);
    for (const v of ["0", "18446744073709551615", "18446744073709551616", "01", "-1", ""])
      try {
        show(`kunaJson ${v}`, kunaAddressFromJsonNumber(v, "address"));
      } catch (error) {
        show(`kunaJson ${v}`, `THROW ${(error as Error).message}`);
      }
    show("within", isPathWithinRoot("/a/b", "/a/bc"));
    show("within2", isPathWithinRoot("/a/b", "/a/b"));
    show("cdpvalue -1", cdpSnapshotValueString(["x"], -1));
    show("cdpstring -1", cdpSnapshotString(["x"], -1));
    show("cdpstring 1.5", cdpSnapshotString(["x", "y"], 1.5));
    show("relative", [".", "..", "./a", "../a", ".hidden", ".//a"].map(isRelativeJavaScriptModuleSpecifier));
    show("subtype", [0x80000002, 0x01000000, 3].map(machoCpuSubtypeBase));
    show("xml", [decodeXmlText("&#x41;"), decodeXmlText("&#X41;"), decodeXmlText("&#0;"), decodeXmlText("&amp;"), decodeXmlText("&#x110000;")]);
    show("canon", canonicalString({ b: 1, a: [1, undefined] }));
  });
});
