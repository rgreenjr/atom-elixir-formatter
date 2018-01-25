"use babel";

import main from "./main";
import { dirname, join } from "path";
import fs from "fs";

export default {
  // returns elixirExecutable setting
  getElixirExecutableSetting() {
    return atom.config.get("atom-elixir-formatter.elixirExecutable");
  },

  // returns quoted elixirExecutable path
  getElixirPath() {
    return this.quotePath(this.getElixirExecutableSetting());
  },

  // returns quoted mixExecutable path
  getMixPath() {
    return this.quotePath(
      join(dirname(this.getElixirExecutableSetting()), "mix")
    );
  },

  // double quote path if it contains spaces
  quotePath(path) {
    return /\s/g.test(path) ? `"${path}"` : path;
  },

  // returns true if project includes a .formatter.exs file
  isFormatterFilePresent() {
    const path = main.getActiveTextEditorRootPath();
    return path && fs.existsSync(join(path, ".formatter.exs"));
  },

  // returns true if package is enabled
  isPackageEnabled() {
    return !atom.packages.isPackageDisabled("atom-elixir-formatter");
  },

  // returns true if files should be formatted on save
  shouldFormatOnSave() {
    switch (atom.config.get("atom-elixir-formatter.formatOnSave")) {
      case "always":
        return true;
        break;
      case "whenFormatterFilePresent":
        return this.isFormatterFilePresent();
        break;
      default:
        return false;
    }
  },

  // returns true if elixirExecutable setting has default value
  shouldRunMixDirectly() {
    return this.getElixirExecutableSetting() === "elixir";
  },

  upgradeSettings() {
    // remove mixExecutable setting (used prior to v0.3.0)
    atom.config.unset("atom-elixir-formatter.mixExecutable");
  }
};
