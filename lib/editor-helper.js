"use babel";

import settings from "./settings";

export default {
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
  },
};
