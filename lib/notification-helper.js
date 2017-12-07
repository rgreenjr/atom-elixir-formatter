"use babel";

export default {
  // shows error notification
  showErrorNotifcation(message, options = {}) {
    options["dismissable"] = true;

    if (atom.config.get("atom-elixir-formatter.showErrorNotifications")) {
      atom.notifications.addError(message, options);
    }
  },

  // dismisses all active notifications
  dismissNotifications() {
    atom.notifications.getNotifications().forEach(n => n.dismiss());
  }
};
