"use babel";

import { CompositeDisposable } from "atom";
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
    path = atom.config.get("atom-elixir-formatter.elixirExecutable");
    return path ? this.quotePath(path) : "elixir";
  },

  // returns mixExecutable setting (defaults to 'mix')
  mixExecutable() {
    path = atom.config.get("atom-elixir-formatter.mixExecutable");
    return path ? this.quotePath(path) : "mix";
  },

  // single quote paths containing spaces
  quotePath(path) {
    return /\s/g.test(path) ? `'${path}'` : path;
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
    return atom.config.get("atom-elixir-formatter.formatOnSave");
  }
};
