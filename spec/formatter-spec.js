"use babel";

import formatter from "../lib/formatter";
import specHelper from "./spec-helper";
import main from "../lib/main";
import notificationHelper from "../lib/notification-helper";
import path from "path";
import process from "child_process";

const validFile = path.join(__dirname, "fixtures", "valid.ex");

describe("Formatter", () => {
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

  describe("formatTextEditor", () => {
    it("formats entire file", () => {
      spyOn(formatter, "runFormat").andReturn({ status: 0 });
      formatter.formatTextEditor(editor);
      str = "defmodule App do\n  def function_name do\n    1 + 1\n  end\nend\n";
      expect(editor.getText()).toEqual(str);
      expect(atom.notifications.getNotifications().length).toBe(0);
    });

    it("displays error notification when status is non-zero", () => {
      spyOn(formatter, "runFormat").andReturn({
        status: 1,
        stderr: "stderr msg"
      });

      formatter.formatTextEditor(editor);
      specHelper.verifyNotification("Elixir Formatter Error", {
        type: "error",
        detail: "stderr msg"
      });
    });

    it("displays error notification when an exception is thrown", () => {
      spyOn(formatter, "runFormat").andThrow("exception msg");
      formatter.formatTextEditor(editor);
      specHelper.verifyNotification("Elixir Formatter Exception", {
        type: "error",
        detail: "exception msg"
      });
    });

    it("dismisses outstanding notifications when successful", () => {
      spyOn(formatter, "runFormat").andReturn({ status: 0, stdout: "result" });
      spyOn(notificationHelper, "dismissNotifications");
      formatter.formatActiveTextEditor();
      expect(notificationHelper.dismissNotifications).toHaveBeenCalled();
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
            specHelper.verifyNotification(
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
      spyOn(main, "isWindowsPlatform").andReturn(false);
    });

    it("calls mix directly when elixirExecutable has default value", () => {
      formatter.runFormat(editor);
      expect(process.spawnSync).toHaveBeenCalledWith(
        "mix",
        ["format", "--check-equivalent", editor.getPath()],
        { cwd: path.dirname(validFile) }
      );
    });

    it("uses elixirExecutable setting when defined", () => {
      atom.config.set(
        "atom-elixir-formatter.elixirExecutable",
        "/path/to/elixir"
      );
      formatter.runFormat(editor);
      expect(process.spawnSync).toHaveBeenCalledWith(
        "/path/to/elixir",
        ["/path/to/mix", "format", "--check-equivalent", editor.getPath()],
        { cwd: path.dirname(validFile) }
      );
    });

    it("doesn't set cwd when editor's root path is null", () => {
      spyOn(main, "getActiveTextEditorRootPath").andReturn(null);
      formatter.runFormat(editor);
      expect(process.spawnSync).toHaveBeenCalledWith(
        "mix",
        ["format", "--check-equivalent", editor.getPath()],
        {}
      );
    });
  });

  describe("runFormat on Windows", () => {
    it("enables shell option when platform is Windows", () => {
      spyOn(process, "spawnSync").andReturn({});
      spyOn(main, "isWindowsPlatform").andReturn(true);
      formatter.runFormat(editor);
      expect(process.spawnSync).toHaveBeenCalledWith(
        "mix",
        ["format", "--check-equivalent", editor.getPath()],
        {
          cwd: path.dirname(validFile),
          shell: true
        }
      );
    });
  });
});
