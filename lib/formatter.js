"use babel";

import main from "./main";
import settings from "./settings";
import editorHelper from "./editor-helper";
import notificationHelper from "./notification-helper";
import fs from "fs";
import path from "path";
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
        editorHelper.getTextInRange(editor, range),
        editor
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
  runFormat(text, editor) {
    let command = "mix";
    let args = ["format", "--check-equivalent", "-"];
    let options = this.getCommandOptions(text, editor);

    if (!settings.shouldRunMixDirectly()) {
      command = settings.getElixirPath();
      args.unshift(settings.getMixPath());
    }

    return process.spawnSync(command, args, options);
  },

  getCommandOptions(text, editor) {
    let options = { input: text };

    projectPath = main.getActiveTextEditorRootPath();
    if (projectPath && editor) {
      // set cwd to dir of nearest .formatter.exs file
      options.cwd = this.nearestFormatterConfig(projectPath, editor);
    }

    // batch files must executed in separate shell on Windows
    if (main.isWindowsPlatform()) {
      options.shell = true;
    }

    return options;
  },

  nearestFormatterConfig(projectPath, editor) {
    let currentPath = path.dirname(editor.getPath());

    while (currentPath != projectPath) {
      formatterPath = path.join(currentPath, ".formatter.exs");
      if (fs.existsSync(formatterPath)) {
        return currentPath;
      }
      currentPath = path.dirname(currentPath);
    }

    return projectPath;
  }
};
