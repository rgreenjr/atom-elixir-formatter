"use babel";

import notificationHelper from "../lib/notification-helper";

describe("NotificationHelper", () => {
  describe("dismissNotifications", () => {
    it("dismisses outstanding notifications", () => {
      atom.notifications.addError("Notification 1", { dismissable: true });
      atom.notifications.addError("Notification 2", { dismissable: true });

      expect(atom.notifications.getNotifications()[0].dismissed).toBe(false);
      expect(atom.notifications.getNotifications()[1].dismissed).toBe(false);

      notificationHelper.dismissNotifications();

      expect(atom.notifications.getNotifications()[0].dismissed).toBe(true);
      expect(atom.notifications.getNotifications()[1].dismissed).toBe(true);
    });
  });
});
