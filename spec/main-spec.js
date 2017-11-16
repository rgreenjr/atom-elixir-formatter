"use babel";

import * as path from "path";
import main from "../lib/main";

const validFile = path.join(__dirname, "fixtures", "valid.ex");

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Main", () => {
  let activationPromise;

  beforeEach(() => {
    activationPromise = atom.packages.activatePackage("atom-elixir-formatter");

    waitsForPromise(() =>
      atom.packages
        .activatePackage("language-elixir")
        .then(() => atom.workspace.open(validFile))
    );
  });

  it("should be in packages list", () => {
    expect(atom.packages.isPackageLoaded("atom-elixir-formatter")).toBe(true);
  });

  it("should be an active package", () => {
    expect(atom.packages.isPackageActive("atom-elixir-formatter")).toBe(true);
  });

  describe("package settings", () => {
    it("should default formatOnSave to true", () => {
      expect(atom.config.get("atom-elixir-formatter.formatOnSave")).toBe(true);
    });

    it("should default showErrorNotifications to true", () => {
      expect(
        atom.config.get("atom-elixir-formatter.showErrorNotifications")
      ).toBe(true);
    });

    it("should default elixirExecutable to 'elixir'", () => {
      expect(atom.config.get("atom-elixir-formatter.elixirExecutable")).toEqual(
        "elixir"
      );
    });
  });

  describe("getElixirPath", () => {
    it("returns unquoted path when elixirExecutable has no spaces", () => {
      atom.config.set(
        "atom-elixir-formatter.elixirExecutable",
        "/path/to/elixir"
      );
      expect(main.getElixirPath()).toEqual("/path/to/elixir");
    });

    it("returns quoted path when elixirExecutable has spaces", () => {
      atom.config.set(
        "atom-elixir-formatter.elixirExecutable",
        "/path with spaces/mix"
      );
      expect(main.getElixirPath()).toEqual('"/path with spaces/mix"');
    });
  });

  describe("getMixPath", () => {
    it("returns path based on elixirExecutable setting", () => {
      atom.config.set(
        "atom-elixir-formatter.elixirExecutable",
        "/path/to/elixir"
      );
      expect(main.getMixPath()).toEqual("/path/to/mix");
    });

    it("returns quoted path based on elixirExecutable", () => {
      atom.config.set(
        "atom-elixir-formatter.elixirExecutable",
        "/path with spaces/elixir"
      );
      expect(main.getMixPath()).toEqual('"/path with spaces/mix"');
    });
  });
});
