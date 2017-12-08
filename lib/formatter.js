"use babel";

import main from "./main";
import settings from "./settings";
import editorHelper from "./editor-helper";
import notificationHelper from "./notification-helper";
import fs from "fs";
import process from "child_process";

export default {
  // formats the active text editor
  formatActiveTextEditor() {
    if ((editor = atom.workspace.getActiveTextEditor())) {
      if (editorHelper.hasElixirGrammar(editor)) {
        this.formatTextEditor(editor, editorHelper.getSelectedRange(editor));
      } else {
        atom.notifications.addInfo(
          "Elixir Formatter only formats Elixir source code",
          { dismissable: false }
        );
      }
    }
  },

  // formats the given text editor
  formatTextEditor(editor, range = null) {
    try {
      const { status, stdout, stderr, error } = this.runFormat(
        editorHelper.getTextInRange(editor, range)
      );

      if (status == 0 && (!stderr || !stderr.length) && !error) {
        editorHelper.insertText(editor, range, stdout.toString());
        notificationHelper.dismissNotifications();
      } else {
        notificationHelper.showErrorNotifcation("Elixir Formatter Error", {
          detail: stderr || error
        });
      }
    } catch (exception) {
      notificationHelper.showErrorNotifcation("Elixir Formatter Exception", {
        detail: exception,
        stack: exception.stack
      });
    }
  },

  // runs mix format process and returns response
  runFormat(text) {
    var opts = { input: text };

    // set cwd to editor projectPath so ".formatter.exs" file can be used
    if ((projectPath = main.projectPath())) {
      opts.cwd = projectPath;
    }

    // batch files must executed in separate shell on Windows
    if (main.isWindowsPlatform()) {
      opts.shell = true;
    }

    if (settings.shouldRunMixDirectly()) {
      return process.spawnSync("mix", ["format", "-"], opts);
    } else {
      return process.spawnSync(
        settings.getElixirPath(),
        [settings.getMixPath(), "format", "-"],
        opts
      );
    }
  }
};
