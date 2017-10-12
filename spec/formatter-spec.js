"use babel";

import * as path from "path";
import formatter from "../lib/formatter";
import helper from "./helper";
import main from "../lib/main";
import process from "child_process";

const validFile = path.join(__dirname, "fixtures", "valid.ex");

describe("Formatter", () => {
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

  describe("formatTextEditor", () => {
    it("formats all text when range parameter not given", () => {
      spyOn(formatter, "runFormat").andReturn({
        status: 0,
        stdout: "replacement text",
        stderr: null
      });

      const editor = atom.workspace.getActiveTextEditor();
      editor.setText("initial text");
      formatter.formatTextEditor(editor);
      expect(editor.getText()).toEqual("replacement text");
      expect(atom.notifications.getNotifications().length).toBe(0);
    });

    it("formats specified text range when range parameter given", () => {
      spyOn(formatter, "runFormat").andReturn({
        status: 0,
        stdout: "REPLACEMENT TEXT\n",
        stderr: null
      });

      const editor = atom.workspace.getActiveTextEditor();
      editor.setText("Row1\nRow2\nRow3");
      editor.setSelectedBufferRange([[1, 0], [2, 0]]); // select 2nd row
      formatter.formatTextEditor(editor, editor.getSelectedBufferRange());
      expect(editor.getText()).toEqual("Row1\nREPLACEMENT TEXT\nRow3");
      expect(atom.notifications.getNotifications().length).toBe(0);
    });

    it("displays error notification when status is nonzero", () => {
      spyOn(formatter, "runFormat").andReturn({
        status: 1,
        stdout: null,
        stderr: "stderr msg"
      });

      formatter.formatTextEditor(atom.workspace.getActiveTextEditor());
      helper.verifyNotification("Elixir Formatter Error", {
        type: "error",
        detail: "stderr msg"
      });
    });

    it("displays error notification when exception is thrown", () => {
      spyOn(formatter, "runFormat").andThrow("exception msg");
      formatter.formatTextEditor(atom.workspace.getActiveTextEditor());
      helper.verifyNotification("Elixir Formatter Exception", {
        type: "error",
        detail: "exception msg"
      });
    });
  });

  describe("formatActiveTextEditor", () => {
    it("displays info notification when file grammar isn't Elixir", () => {
      const filePath = path.join(__dirname, "fixtures", "plain.txt");

      waitsForPromise(() =>
        atom.workspace
          .open(filePath)
          .then(editor => formatter.formatActiveTextEditor())
          .then(() =>
            helper.verifyNotification(
              "Elixir Formatter only formats Elixir source code",
              { type: "info" }
            )
          )
      );
    });
  });

  describe("runFormat", () => {
    beforeEach(function() {
      spyOn(process, "spawnSync").andReturn({});
    });

    it("uses default elixir when elixirExecutable setting undefined", () => {
      atom.config.set("atom-elixir-formatter.elixirExecutable", undefined);
      formatter.runFormat("input text");

      expect(process.spawnSync).toHaveBeenCalledWith(
        "elixir",
        ["mix", "format", "-"],
        { input: "input text", cwd: main.projectPath() }
      );
    });

    it("uses elixirExecutable setting when defined", () => {
      atom.config.set(
        "atom-elixir-formatter.elixirExecutable",
        "/path/to/elixir"
      );
      formatter.runFormat("input text");

      expect(process.spawnSync).toHaveBeenCalledWith(
        "/path/to/elixir",
        ["mix", "format", "-"],
        { input: "input text", cwd: main.projectPath() }
      );
    });

    it("uses default mix when mixExecutable setting undefined", () => {
      atom.config.set("atom-elixir-formatter.mixExecutable", undefined);
      formatter.runFormat("input text");

      expect(process.spawnSync).toHaveBeenCalledWith(
        "elixir",
        ["mix", "format", "-"],
        { input: "input text", cwd: main.projectPath() }
      );
    });

    it("uses mixExecutable setting when defined", () => {
      atom.config.set("atom-elixir-formatter.mixExecutable", "/path/to/mix");
      formatter.runFormat("input text");

      expect(process.spawnSync).toHaveBeenCalledWith(
        "elixir",
        ["/path/to/mix", "format", "-"],
        { input: "input text", cwd: main.projectPath() }
      );
    });

    it("sets cwd when project path defined", () => {
      formatter.runFormat("input text");

      expect(process.spawnSync).toHaveBeenCalledWith(
        "elixir",
        ["mix", "format", "-"],
        { input: "input text", cwd: main.projectPath() }
      );
    });

    it("doesn't set cwd when project path undefined", () => {
      spyOn(main, "projectPath").andReturn(undefined);
      formatter.runFormat("input text");

      expect(process.spawnSync).toHaveBeenCalledWith(
        "elixir",
        ["mix", "format", "-"],
        { input: "input text" }
      );
    });
  });
});
