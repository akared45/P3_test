const { NotificationType } = require('../enums');

class Notification {
  constructor({
    id,
    userId,
    type = NotificationType.SYSTEM,
    title,
    message,
    isRead = false,
    createdAt = new Date(),
    metadata = {}
  }) {
    this.id = id || require('crypto').randomUUID();
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.isRead = Boolean(isRead);
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.metadata = metadata; 

    Object.freeze(this);
  }

  // Logic nghiệp vụ: Đánh dấu đã đọc
  markAsRead() {
    return new Notification({
      ...this,
      isRead: true
    });
  }
}

module.exports = Notification;