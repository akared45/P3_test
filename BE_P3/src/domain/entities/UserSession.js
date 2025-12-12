class UserSession {
  constructor({ userId, refreshToken, expiresAt, revoked = false, createdAt = new Date() }) {
    this.userId = userId;
    this.refreshToken = refreshToken;
    this.expiresAt = new Date(expiresAt);
    this.revoked = Boolean(revoked);
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    Object.freeze(this);
  }

  isValid() {
    return !this.revoked && new Date() < this.expiresAt;
  }
  
  revoke() {
    return new UserSession({
      ...this,
      revoked: true
    });
  }
}
module.exports = UserSession;