"use babel";

import { dirname, join } from "path";

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

  // returns true if formatOnSave setting is enabled
  shouldFormatOnSave() {
    return atom.config.get("atom-elixir-formatter.formatOnSave");
  },

  // returns true if elixirExecutable setting has default value
  shouldRunMixDirectly() {
    return this.getElixirExecutableSetting() === "elixir";
  },

  upgrade_settings() {
    // remove mixExecutable setting (used prior to v0.3.0)
    atom.config.unset("atom-elixir-formatter.mixExecutable");
  }
};
