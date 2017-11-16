"use babel";

export default {
  formatOnSave: {
    title: "Format on Save",
    description: "Automatically format files on save.",
    type: "boolean",
    default: true,
    order: 1
  },
  saveFormatMode: {
    title: "Format on Save mode",
    type: "string",
    default: "always",
    order: 2,
    enum: [
      {value: "always", description: "All Elixir projects."},
      {value: "file_available", description: "Only if project includes formatter.exs file."}
    ]
  },
  showErrorNotifications: {
    title: "Show Error Notifications",
    description: "Show error notifications when formatting fails.",
    type: "boolean",
    default: true,
    order: 3
  },
  elixirExecutable: {
    title: "Elixir Executable",
    description:
      "Use a specific `elixir` executable by providing its absolute path.",
    type: "string",
    default: "elixir",
    order: 4
  },
  mixExecutable: {
    title: "Mix Executable",
    description:
      "Use a specific `mix` executable by providing its absolute path.",
    type: "string",
    default: "mix",
    order: 5
  }
};
