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

  describe("getSelectedRange", () => {
    it("returns range when selection range isn't empty", () => {
      range = { start: { row: 0, column: 0 }, end: { row: 0, column: 4 } };
      editor.setSelectedBufferRange(range);
      expect(editorHelper.getSelectedRange(editor)).toEqual(range);
    });

    it("returns null when selection range is empty", () => {
      range = { start: { row: 0, column: 0 }, end: { row: 0, column: 0 } };
      editor.setSelectedBufferRange(range);
      expect(editorHelper.getSelectedRange(editor)).toEqual(null);
    });
  });

  describe("insertText", () => {
    beforeEach(function() {
      editor.setText("pre-formatted text");
      editor.setCursorScreenPosition({ row: 0, column: 3 });
      text = "post";
    });

    describe("when range is not null", () => {
      it("replaces text in range and places cursor at start of range", () => {
        range = { start: { row: 0, column: 0 }, end: { row: 0, column: 3 } };
        editorHelper.insertText(editor, range, text);
        expect(editor.getText()).toEqual("post-formatted text");
        expect(editor.getCursorScreenPosition()).toEqual({ row: 0, column: 0 });
      });
    });

    describe("when range is null", () => {
      it("replaces entire text buffer and maintains cursor position", () => {
        editorHelper.insertText(editor, null, text);
        expect(editor.getText()).toEqual("post");
        expect(editor.getCursorScreenPosition()).toEqual({ row: 0, column: 3 });
      });
    });
  });

  describe("getTextInRange", () => {
    beforeEach(() => editor.setText("some text"));

    it("returns text in given range", () => {
      const range = [[0, 0], [0, 4]];
      expect(editorHelper.getTextInRange(editor, range)).toEqual("some");
    });

    it("returns all text when range is null", () => {
      expect(editorHelper.getTextInRange(editor, null)).toEqual("some text");
    });

    it("returns all text when no range is given", () => {
      expect(editorHelper.getTextInRange(editor)).toEqual("some text");
    });
  });

  describe("indentText", () => {
    beforeEach(() => (range = { start: { row: 0, column: 0 } }));

    describe("when softTabs is true", () => {
      it("adds spaces to match indention of first line of range", () => {
        editor.softTabs = true;

        editor.setText("no indention");
        expect(editorHelper.indentText(editor, range, "foo")).toEqual("foo");

        editor.setText("    four space indention");
        expect(editorHelper.indentText(editor, range, "foo")).toEqual(
          "    foo"
        );
      });
    });

    describe("when softTabs is false", () => {
      it("adds tabs to match indention of first line of range", () => {
        editor.softTabs = false;

        editor.setText("no indention");
        expect(editorHelper.indentText(editor, range, "foo")).toEqual("foo");

        editor.setText("    four space indention");
        expect(editorHelper.indentText(editor, range, "foo")).toEqual(
          "\t\tfoo"
        );
      });
    });
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
