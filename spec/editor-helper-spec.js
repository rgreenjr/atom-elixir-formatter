"use babel";

import editorHelper from "../lib/editor-helper";
import path from "path";

const validFile = path.join(__dirname, "fixtures", "valid.ex");

describe("EditorHelper", () => {
  let editor;

  beforeEach(() => {
    waitsForPromise(() =>
      atom.packages
        .activatePackage("language-elixir")
        .then(() => atom.workspace.open(validFile))
        .then(() => atom.packages.activatePackage("atom-elixir-formatter"))
    );

    runs(() => (editor = atom.workspace.getActiveTextEditor()));

    atom.packages.triggerDeferredActivationHooks();
  });

  describe("shouldFormatTextEditor", () => {
    it("returns false when editor's grammar is not Elixir", () => {
      editor.setGrammar(atom.grammars.nullGrammar);
      expect(editorHelper.shouldFormatTextEditor(editor)).toEqual(false);
    });

    it("returns false when formatOnSave is never", () => {
      atom.config.set("atom-elixir-formatter.formatOnSave", "never");
      expect(editorHelper.shouldFormatTextEditor(editor)).toEqual(false);
    });

    it("returns false when package is disabled", () => {
      atom.packages.disablePackage("atom-elixir-formatter");
      expect(editorHelper.shouldFormatTextEditor(editor)).toEqual(false);
    });
  });
});
