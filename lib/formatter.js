"use babel";

import main from "./main";
import fs from "fs";
import path from "path";
import process from "child_process";
import tmp from "tmp";

export default {
  // formats the active text editor
  formatActiveTextEditor() {
    if ((editor = atom.workspace.getActiveTextEditor())) {
      if (main.hasElixirGrammar(editor)) {
        this.formatTextEditor(editor);
      } else {
        atom.notifications.addInfo(
          "Elixir Formatter only formats Elixir source code",
          { dismissable: false }
        );
      }
    }
  },

  // formats the given text editor
  formatTextEditor(editor) {
    try {
      const { text, range } = this.currentTextSelection(editor);
      const { status, stdout, stderr } = this.runFormat(text);

      switch (status) {
      case 0: {
        this.insertText(editor, range, stdout.toString());
        break;
      }
      default:
        this.showErrorNotifcation("Elixir Formatter Error", {
          detail: stderr
        });
      }
    } catch (exception) {
      this.showErrorNotifcation("Elixir Formatter Exception", {
        detail: exception,
        stack: exception.stack
      });
    }
  },

  // returns current text selection and range (or entire text if none)
  currentTextSelection(editor) {
    if ((text = editor.getSelectedText())) {
      range = editor.getSelectedBufferRange();
    } else {
      text = editor.getText();
      range = null;
    }

    return { text: text, range: range };
  },

  // runs mix format process and returns response
  runFormat(text) {
    let tmpPath = tmp.tmpNameSync();
    fs.writeFileSync(tmpPath, text);

    result = process.spawnSync(main.mixExecutable(), ["format", tmpPath]);

    if (result.status == 0) {
      return {
        status: result.status,
        stdout: fs.readFileSync(tmpPath, "utf8"),
        stderr: result.stderr
      };
    } else {
      return result;
    }
  },

  // inserts the given text and updates cursor position
  insertText(editor, range, text) {
    if (range) {
      editor.setTextInBufferRange(range, this.indentText(editor, range, text));
      editor.setCursorScreenPosition(range.start);
    } else {
      const cursorPosition = editor.getCursorScreenPosition();
      editor.setText(text);
      editor.setCursorScreenPosition(cursorPosition);
    }
  },

  // indents text using indentation level of first line of range
  indentText(editor, range, text) {
    const indentation = editor.indentationForBufferRow(range.start.row);

    if (editor.softTabs) {
      prefix = " ".repeat(indentation * editor.getTabLength());
    } else {
      prefix = "\t".repeat(indentation);
    }

    return prefix + text.replace(/\n/g, "\n" + prefix);
  },

  // shows error notification
  showErrorNotifcation(message, options = {}) {
    options["dismissable"] = true;

    if (atom.config.get("atom-elixir-formatter.showErrorNotifications")) {
      atom.notifications.addError(message, options);
    }
  }
};
