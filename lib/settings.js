"use babel";

export default {
  formatOnSave: {
    title: "Format on Save",
    description: "Automatically format files on save.",
    type: "boolean",
    default: true,
    order: 1
  },
  showErrorNotifications: {
    title: "Show Error Notifications",
    description: "Show error notifications when formatting fails.",
    type: "boolean",
    default: true,
    order: 2
  },
  mixExecutable: {
    title: "Mix Executable",
    description:
      "Use a specific `mix` executable by providing its absolute path.",
    type: "string",
    default: "mix",
    order: 3
  }
};
