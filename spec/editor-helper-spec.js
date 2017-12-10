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
    it("returns range when selection range isn't empty", () => {
      const editor = atom.workspace.getActiveTextEditor();
      editor.setSelectedBufferRange([[0, 0], [0, 4]]);
      expect(editorHelper.getSelectedRange(editor)).toEqual({
        start: { row: 0, column: 0 },
        end: { row: 0, column: 4 }
      });
    });

    it("returns null when selection range is empty", () => {
      const editor = atom.workspace.getActiveTextEditor();
      editor.setSelectedBufferRange([[0, 2], [0, 2]]);
      expect(editorHelper.getSelectedRange(editor)).toEqual(null);
    });
  });

  describe("insertText", () => {
    beforeEach(function() {
      editor = atom.workspace.getActiveTextEditor();
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
    beforeEach(function() {
      editor = atom.workspace.getActiveTextEditor();
      editor.setText("some text");
    });

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
    beforeEach(function() {
      editor = atom.workspace.getActiveTextEditor();
      range = { start: { row: 0, column: 0 } };
    });

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
});
