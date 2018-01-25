"use babel";

import settings from "./settings";

export default {
  getSelectedRange(editor) {
    range = editor.getSelectedBufferRange();
    return range.isEmpty() ? null : range;
  },

  // returns text in given range (or entire text if no range given)
  getTextInRange(editor, range = null) {
    if (range) {
      return editor.getTextInBufferRange(range);
    } else {
      return editor.getText();
    }
  },

  // inserts the given text and updates cursor position
  insertText(editor, range, text) {
    if (range) {
      editor.setTextInBufferRange(range, this.indentText(editor, range, text));
      editor.setCursorScreenPosition(range.start);
    } else {
      const cursorPosition = editor.getCursorScreenPosition();
      editor.getBuffer().setTextViaDiff(text);
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

  // returns true if editor grammar is elixir
  hasElixirGrammar(editor) {
    return editor.getGrammar().scopeName === "source.elixir";
  },

  // returns true if editor should be formatted
  shouldFormatTextEditor(editor) {
    return (
      this.hasElixirGrammar(editor) &&
      settings.shouldFormatOnSave() &&
      settings.isPackageEnabled()
    );
  }
};
