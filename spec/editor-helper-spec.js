"use babel";

import editorHelper from "../lib/editor-helper";
import path from "path";

const validFile = path.join(__dirname, "fixtures", "valid.ex");

describe("EditorHelper", () => {
  let activationPromise;

  beforeEach(() => {
    activationPromise = atom.packages.activatePackage("atom-elixir-formatter");
    waitsForPromise(() =>
      atom.packages
        .activatePackage("language-elixir")
        .then(() => atom.workspace.open(validFile))
    );
    atom.packages.triggerDeferredActivationHooks();
  });

  describe("getSelectedRange", () => {
    it("returns null when selected buffer range is empty", () => {
      const editor = atom.workspace.getActiveTextEditor();
      editor.setText("some text");
      editor.setSelectedBufferRange([[0, 2], [0, 2]]);
      expect(editorHelper.getSelectedRange(editor)).toEqual(null);
    });

    it("returns selected buffer range", () => {
      const editor = atom.workspace.getActiveTextEditor();
      editor.setText("some text");
      editor.setSelectedBufferRange([[0, 0], [0, 4]]);
      expect(editorHelper.getSelectedRange(editor)).toEqual(
        editor.getSelectedBufferRange()
      );
    });
  });
});
