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
      if (!editor.getPath()) {
        atom.notifications.addInfo(
          "Elixir Formatter only formats saved files",
          { dismissable: false }
        );
      } else {
        if (editorHelper.hasElixirGrammar(editor)) {
          this.formatTextEditor(editor);
        } else {
          atom.notifications.addInfo(
            "Elixir Formatter only formats Elixir source code",
            { dismissable: false }
          );
        }
      }
    }
  },

  // formats the given text editor
  formatTextEditor(editor) {
    try {
      const { status, stdout, stderr, error } = this.runFormat(editor);

      if (status == 0 && (!stderr || !stderr.length) && !error) {
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
  runFormat(editor) {
    let command = "mix";
    let args = ["format", "--check-equivalent"];
    let projectPath = main.getActiveTextEditorRootPath(projectPath);
    let options = this.getCommandOptions(editor, projectPath);

    // add --dot-formatter arg
    this.setDotFormatter(editor, projectPath, args);

    // add source file arg
    args.push(editor.getPath());

    if (!settings.shouldRunMixDirectly()) {
      command = settings.getElixirPath();
      args.unshift(settings.getMixPath());
    }

    return process.spawnSync(command, args, options);
  },

  setDotFormatter(editor, projectPath, args) {
    if (projectPath && editor) {
      nearestFormatterPath = this.nearestDotFormatter(editor, projectPath);
      if (nearestFormatterPath) {
        // pass nearest .formatter.exs file
        args.push("--dot-formatter", nearestFormatterPath);
      }
    }
    return args;
  },

  getCommandOptions(editor, projectPath) {
    let options = {};

    if (projectPath && editor) {
      // set current working directory to project root
      options.cwd = projectPath;
    }

    if (main.isWindowsPlatform()) {
      // batch files must executed in separate shell on Windows
      options.shell = true;
    }

    return options;
  },

  // Returns path to nearest .formatter.exs file
  nearestDotFormatter(editor, projectPath) {
    let currentPath = path.dirname(editor.getPath());

    while (currentPath != projectPath) {
      formatterPath = path.join(currentPath, ".formatter.exs");
      if (fs.existsSync(formatterPath)) {
        return formatterPath;
      }
      currentPath = path.dirname(currentPath);
    }

    return null;
  }
};
