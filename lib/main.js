"use babel";

import { CompositeDisposable } from "atom";
import config from "./config";
import editorHelper from "./editor-helper";
import formatter from "./formatter";
import path from "path";
import settings from "./settings";

export default {
  config,
  subscriptions: null,

  // registers commands and event hooks
  activate(state) {
    settings.upgradeSettings();

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
      if (editorHelper.shouldFormatTextEditor(editor)) {
        formatter.formatTextEditor(editor);
      }
    });
  },

  // returns true if operating system platform is Windows
  isWindowsPlatform() {
    return process.platform === "win32";
  },

  // returns root path for active editor
  getActiveTextEditorRootPath() {
    const editor = atom.workspace.getActiveTextEditor();
    return atom.project.relativizePath(editor.getPath()).shift();
  }
};
