import { describe, it, expect } from "vitest";
import { relative, resolve, sep, isAbsolute } from "node:path";

import { compareUnicodeCodePoints } from "../../../src/domain/unicodeCodePointOrder.js";
import { webSourceOffset } from "../../../src/domain/webSourcePosition.js";
import { isPathWithinRoot } from "../../../src/domain/localPath.js";
import { parseBytePattern } from "../../../src/domain/native/bytePattern.js";
import { redactExplicitText } from "../../../src/domain/explicitSensitiveValues.js";
import {
  androidLocaleDirectorySuffix,
  classifyAndroidStringsTable,
} from "../../../src/domain/apktool/apktoolResourceAnalysis.js";
import { parseCapinfosOutput } from "../../../src/pcap/PcapOutput.js";
import { parseGhidraJavaProperties } from "../../../src/ghidra/GhidraJavaProperties.js";

const cmpRef = (a: string, b: string): number => {
  const la = [...a].map((c) => c.codePointAt(0)!);
  const lb = [...b].map((c) => c.codePointAt(0)!);
  for (let i = 0; i < Math.min(la.length, lb.length); i++) {
    if (la[i] !== lb[i]) return la[i]! - lb[i]!;
  }
  return la.length === lb.length ? 0 : la.length < lb.length ? -1 : 1;
};

// reference offset from (line, col)
const offsetRef = (text: string, line: number, column: number) => {
  const lines = text.split(/\r\n|[\r\n\u2028\u2029]/u);
  if (line < 1 || line > lines.length) return undefined;
  const target = lines[line - 1]!;
  if (column > target.length) return undefined;
  let offset = 0;
  for (let i = 0; i < line - 1; i++) {
    // length of the terminator after line i
    let j = 0;
    let k = 0;
    for (let idx = 0; idx < lines.length; idx++) {
      // not used
      void idx;
    }
    void j;
    void k;
  }
  // compute by scanning
  const re = /\r\n|[\r\n\u2028\u2029]/u;
  let seen = 0;
  let start = 0;
  let m: RegExpExecArray | null;
  const g = new RegExp(re.source, "gu");
  while ((m = g.exec(text)) !== null) {
    seen++;
    if (seen === line) break;
    start = m.index + m[0].length;
  }
  return start + column;
};

describe("probe", () => {
  it("compareUnicodeCodePoints", () => {
    const samples = ["", "a", "b", "A", "z", "é", "😀", "\u{1F600}", "\uFFFF", "\uFFFD", "ab", "a\u{10000}", "\uD800", "a\uD800", "\uDBFF\uDFFF", "0", "9"];
    for (const a of samples)
      for (const b of samples)
        expect(compareUnicodeCodePoints(a, b), JSON.stringify([a, b])).toBe(cmpRef(a, b));
  });

  it("webSourceOffset", () => {
    const texts = ["", "a", "a\nb", "a\n", "a\r\nb", "a\rb", "ab\u2028cd", "\n\n", "abc\ndef\r\nghi"];
    for (const t of texts) {
      for (let line = 1; line <= 5; line++) {
        for (let column = 0; column <= t.length; column++) {
          const got = webSourceOffset(t, { line, column });
          const want = offsetRef(t, line, column);
          expect(got, JSON.stringify({ t, line, column })).toBe(want);
        }
      }
    }
  });

  it("isPathWithinRoot", () => {
    const cases: [string, string][] = [
      ["/a/b", "/a/b"],
      ["/a/b", "/a/b/c"],
      ["/a/b", "/a/bc"],
      ["/a/b", "/a/b/../c"],
      ["/a/b", "/a"],
      ["/a/b", "/a/b/"],
      ["/", "/a"],
      ["/a/b", "/a/b/./c"],
      ["/a/b", "/a/b//c"],
    ];
    for (const [root, path] of cases) {
      const rel = relative(root, path);
      const want = rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel));
      expect(isPathWithinRoot(root, path), JSON.stringify([root, path])).toBe(want);
    }
  });

  it("parseBytePattern", () => {
    console.log("bp1", JSON.stringify(parseBytePattern("48 8b")));
    console.log("bp2", JSON.stringify(parseBytePattern("48 ??", "ff 00")));
    console.log("bp3", JSON.stringify(parseBytePattern("?? ff", "00 ff")));
    console.log("bp4", JSON.stringify(parseBytePattern("48", "00")));
    console.log("bp5", JSON.stringify(parseBytePattern("488b")));
    console.log("bp6", JSON.stringify(parseBytePattern("48\t8b")));
  });

  it("redact", () => {
    console.log("r1", JSON.stringify(redactExplicitText("password=hunter2", ["hunter2"])));
    console.log("r2", JSON.stringify(redactExplicitText("abc", ["ab", "bc"])));
    console.log("r3", JSON.stringify(redactExplicitText("aaa", ["aa"])));
    console.log("r4", JSON.stringify(redactExplicitText("x", ["[REDACTED]"])));
    console.log("r5", JSON.stringify(redactExplicitText("secret+secret", ["secret"])));
  });

  it("locale", () => {
    console.log("l1", androidLocaleDirectorySuffix("pt-BR"));
    console.log("l2", JSON.stringify(classifyAndroidStringsTable("pt-BR")));
    console.log("l3", JSON.stringify(classifyAndroidStringsTable("pt-rBR")));
    console.log("l4", JSON.stringify(classifyAndroidStringsTable("")));
    console.log("l5", JSON.stringify(classifyAndroidStringsTable("en-419")));
    console.log("l6", JSON.stringify(classifyAndroidStringsTable("b+zh+Hans+CN")));
  });

  it("capinfos", () => {
    const base =
      "File type:                       Wireshark/... capture file\nFile encapsulation:              Ethernet\nNumber of packets:               3\n";
    console.log("c1", JSON.stringify(parseCapinfosOutput(base + "Earliest packet time: 1.5\nLatest packet time: -0.25\nCapture duration: 1.75 seconds\n")));
    console.log("c2", JSON.stringify(parseCapinfosOutput(base + "Capture duration: n/a\n")));
  });

  it("javaProps", () => {
    const p = (s: string) => {
      const r = parseGhidraJavaProperties(s);
      return r.ok ? [...r.value.entries()] : `ERR:${r.error}`;
    };
    console.log("j1", JSON.stringify(p("a=1\nb:2\nc 3\n")));
    console.log("j2", JSON.stringify(p("a\\=b=c\n")));
    console.log("j3", JSON.stringify(p("a=1\\\n    2\n")));
    console.log("j4", JSON.stringify(p("a=1\\u0041\n")));
    console.log("j5", JSON.stringify(p("a=\\ x\n")));
    console.log("j6", JSON.stringify(p("# c\\\\\na=1\n")));
    console.log("j7", JSON.stringify(p("a=1\r\nb=2\r\n")));
    expect(true).toBe(true);
  });
});
