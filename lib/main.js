"use babel";

import { CompositeDisposable } from "atom";
import config from "./config";
import formatter from "./formatter";
import fs from "fs";
import path from "path";
import settings from "./settings";

export default {
  config,
  subscriptions: null,

  // registers commands and event hooks
  activate(state) {
    settings.upgrade_settings();

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
      if (settings.shouldFormatOnSave() && this.hasElixirGrammar(editor)) {
        formatter.formatTextEditor(editor);
      }
    });
  },

  // returns true if editor grammar is elixir
  hasElixirGrammar(editor) {
    return editor.getGrammar().scopeName === "source.elixir";
  },

  // returns path of current atom project
  projectPath() {
    return atom.project.getPaths()[0];
  }
};
