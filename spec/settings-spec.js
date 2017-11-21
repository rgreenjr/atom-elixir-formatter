"use babel";

import path from "path";
import settings from "../lib/settings";

const validFile = path.join(__dirname, "fixtures", "valid.ex");

describe("Settings", () => {
  let activationPromise;

  beforeEach(() => {
    activationPromise = atom.packages.activatePackage("atom-elixir-formatter");

    waitsForPromise(() =>
      atom.packages
        .activatePackage("language-elixir")
        .then(() => atom.workspace.open(validFile))
    );
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
    it("returns elixirExecutable", () => {
      atom.config.set(
        "atom-elixir-formatter.elixirExecutable",
        "/path/to/elixir"
      );
      expect(settings.getElixirPath()).toEqual("/path/to/elixir");
    });
  });

  describe("getMixPath", () => {
    it("returns path based on elixirExecutable setting", () => {
      atom.config.set(
        "atom-elixir-formatter.elixirExecutable",
        "/path/to/elixir"
      );
      expect(settings.getMixPath()).toEqual("/path/to/mix");
    });
  });

  describe("quotePath", () => {
    it("returns quoted path when it contains spaces", () => {
      expect(settings.quotePath("/with spaces")).toEqual('"/with spaces"');
    });

    it("returns unquoted path when it does not contains spaces", () => {
      expect(settings.quotePath("/no/spaces")).toEqual("/no/spaces");
    });
  });
});
