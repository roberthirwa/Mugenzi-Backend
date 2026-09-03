import { NotificationItem } from "../types/domain";

export class NotificationService {
  /**
   * Create a new notification item
   */
  static createNotification(
    title: string,
    body: string,
    type: NotificationItem["type"] = "system"
  ): NotificationItem {
    return {
      id: "notif-" + Date.now(),
      title,
      body,
      timestamp: "Just now",
      read: false,
      type,
    };
  }

  /**
   * Count unread notifications
   */
  static getUnreadCount(notifications: NotificationItem[]): number {
    return notifications.filter((n) => !n.read).length;
  }
}
