const UserSession = require("../../../../domain/entities/UserSession");

class UserSessionMapper {
  static toDomain(doc) {
    if (!doc) return null;
    return new UserSession({
      userId: doc.userId,
      refreshToken: doc.refreshToken,
      expiresAt: doc.expiresAt,
      revoked: doc.revoked,
      createdAt: doc.createdAt,
    });
  }

  static toPersistence(entity) {
    return {
      userId: entity.userId,
      refreshToken: entity.refreshToken,
      expiresAt: entity.expiresAt,
      revoked: entity.revoked,
      createdAt: entity.createdAt,
    };
  }
}

module.exports = UserSessionMapper;