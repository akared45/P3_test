const NotificationType = require('../enums/NotificationType');

class Notification {
  constructor({
    id,
    userId,
    title,
    message,
    type = NotificationType.SYSTEM_ALERT,
    isRead = false,
    link = null,
    createdAt = new Date()
  }) {
    if (!userId) throw new Error("Notification: userId is required");
    if (!title) throw new Error("Notification: title is required");
    if (!message) throw new Error("Notification: message is required");

    if (!Object.values(NotificationType).includes(type)) {
      throw new Error(`Notification: Invalid type ${type}`);
    }

    this.id = id;
    this.userId = userId;
    this.title = title;
    this.message = message;
    this.type = type;
    this.isRead = isRead;
    this.link = link;
    this.createdAt = createdAt;
  }
  markAsRead() {
    if (this.isRead) return this;

    const Constructor = this.constructor;
    return new Constructor({
      ...this,
      isRead: true
    });
  }
}

module.exports = Notification;