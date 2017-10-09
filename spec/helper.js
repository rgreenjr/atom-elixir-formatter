"use babel";

export default {
  verifyNotification(message, options = {}) {
    notifications = atom.notifications.getNotifications();

    expect(notifications.length).toBe(1);
    notification = notifications[0];
    expect(notification.getMessage()).toEqual(message);

    if (options.type) {
      expect(notification.getType()).toEqual(options.type);
    }

    if (options.detail) {
      expect(notification.getDetail()).toEqual(options.detail);
    }
  }
};
