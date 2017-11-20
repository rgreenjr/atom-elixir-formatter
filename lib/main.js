"use babel";

import { CompositeDisposable } from "atom";
import fs from "fs";
import path from "path";
import config from "./settings";
import formatter from "./formatter";

export default {
  config,
  subscriptions: null,

  // registers commands and event hooks
  activate(state) {
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

  // returns elixirExecutable setting (defaults to 'elixir')
  elixirExecutable() {
    const elixirPath = atom.config.get("atom-elixir-formatter.elixirExecutable");
    return elixirPath ? this.quotePath(elixirPath) : "elixir";
  },

  // returns mixExecutable setting (defaults to 'mix')
  mixExecutable() {
    const mixPath = atom.config.get("atom-elixir-formatter.mixExecutable");
    return mixPath ? this.quotePath(mixPath) : "mix";
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
  }
};
