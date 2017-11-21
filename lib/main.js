"use babel";

import { CompositeDisposable } from "atom";
import config from "./settings";
import formatter from "./formatter";
import path from "path";
import fs from "fs";

export default {
  config,
  subscriptions: null,

  // registers commands and event hooks
  activate(state) {
    this.upgrade_settings();

    this.subscriptions = new CompositeDisposable();

    // register format command
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "atom-elixir-formatter:format": () => formatter.formatActiveTextEditor()
      })
    );

    // register to receive text editor events
    this.subscriptions.add(
      atom.workspace.observeTextEditors(e => this.handleTextEvents(e))
    );
  },

  // deregisters commands and event hooks
  deactivate() {
    this.subscriptions.dispose();
  },

  // handle text editor events
  handleTextEvents(editor) {
    editor.getBuffer().onWillSave(() => {
      if (this.shouldFormatOnSave() && this.hasElixirGrammar(editor)) {
        formatter.formatTextEditor(editor);
      }
    });
  },

  // returns setting for elixirExecutable
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
      path.join(path.dirname(this.getElixirExecutableSetting()), "mix")
    );
  },

  // double quote paths containing spaces
  quotePath(p) {
    return /\s/g.test(p) ? `"${p}"` : p;
  },

  // returns true if editor grammar is elixir
  hasElixirGrammar(editor) {
    return editor.getGrammar().scopeName === "source.elixir";
  },

  // returns path of current atom project
  projectPath() {
    return atom.project.getPaths()[0];
  },

  // returns true if formatOnSave setting is enabled
  shouldFormatOnSave() {
    const formatOnSave = atom.config.get("atom-elixir-formatter.formatOnSave");
    const saveFormatMode = atom.config.get("atom-elixir-formatter.saveFormatMode");
    return formatOnSave && (saveFormatMode === "always" || this.isFormatFilePresent());
  },

  // returns true if there's a elixir formatter file present in the root folder
  isFormatFilePresent() {
    const formatterPath = path.join(this.projectPath(), ".formatter.exs");
    return fs.existsSync(formatterPath);
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
