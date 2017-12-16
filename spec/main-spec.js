"use babel";

import path from "path";
import main from "../lib/main";

const validFile = path.join(__dirname, "fixtures", "valid.ex");

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Main", () => {
  beforeEach(() => {
    waitsForPromise(() =>
      atom.packages
        .activatePackage("language-elixir")
        .then(() => atom.workspace.open(validFile))
        .then(() => atom.packages.activatePackage("atom-elixir-formatter"))
    );

    atom.packages.triggerDeferredActivationHooks();
  });

  it("should be in packages list", () => {
    expect(atom.packages.isPackageLoaded("atom-elixir-formatter")).toBe(true);
  });

  it("should be an active package", () => {
    expect(atom.packages.isPackageActive("atom-elixir-formatter")).toBe(true);
  });
});
