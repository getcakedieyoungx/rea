import { describe, it, expect } from "vitest";

import {
  embeddedDyldOverrides,
  hasApplicableDyldOverrides,
} from "../../../src/domain/apple/dyldEnvironment.js";

// dyld only consults the versioned search paths for the image kind named in
// the variable: DYLD_VERSIONED_LIBRARY_PATH for libraries,
// DYLD_VERSIONED_FRAMEWORK_PATH for frameworks. A setting scoped to one kind
// must not claim it can affect a dependency of the other kind.
const dylib = "/usr/lib/libz.1.dylib";
const framework = "/opt/app/Foo.framework/Foo";

describe("versioned dyld search path scope", () => {
  it("does not apply a framework-only versioned path to a plain dylib", () => {
    const overrides = embeddedDyldOverrides(
      ["DYLD_VERSIONED_FRAMEWORK_PATH=/opt/versions"],
      [],
    );

    expect(hasApplicableDyldOverrides(overrides, framework, true)).toBe(true);
    // Fails today: the override is recorded with scope "all", so the library
    // dependency is reported as affected.
    expect(hasApplicableDyldOverrides(overrides, dylib, true)).toBe(false);
  });

  it("does not apply a library-only versioned path to a framework install name", () => {
    const overrides = embeddedDyldOverrides(
      ["DYLD_VERSIONED_LIBRARY_PATH=/opt/versions"],
      [],
    );

    expect(hasApplicableDyldOverrides(overrides, dylib, true)).toBe(true);
    // Fails today for the mirror-image reason.
    expect(hasApplicableDyldOverrides(overrides, framework, true)).toBe(false);
  });
});