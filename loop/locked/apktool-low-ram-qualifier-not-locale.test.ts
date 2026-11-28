import { expect, it } from "vitest";

import {
  androidLocaleQualifierSchema,
  classifyAndroidStringsTable,
} from "../../../src/domain/apktool/apktoolResourceAnalysis.js";

it("refuses the Android low-RAM qualifier as a locale selector", () => {
  // "low" is a resource configuration qualifier (low-RAM devices), not a
  // language tag; selecting it as a locale names no strings table.
  expect(androidLocaleQualifierSchema.safeParse("low").success).toBe(false);
});

it("preserves values-low as a non-locale configuration suffix", () => {
  expect(classifyAndroidStringsTable("low")).toEqual({
    kind: "other",
    suffix: "low",
  });
});