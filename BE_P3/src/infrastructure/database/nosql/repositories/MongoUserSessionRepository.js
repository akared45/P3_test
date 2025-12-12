const IUserSessionRepository = require("../../../../domain/repositories/IUserSessionRepository");
const UserSessionModel = require("../models/UserSessionModel");
const UserSession = require("../../../../domain/entities/UserSession");

class MongoUserSessionRepository extends IUserSessionRepository {

  _toDomain(doc) {
    if (!doc) return null;
    return new UserSession({
      userId: doc.userId,
      refreshToken: doc.refreshToken,
      expiresAt: doc.expiresAt,
      revoked: doc.revoked,
      createdAt: doc.createdAt,
    });
  }

  async save(sessionEntity) {
    const dataToSave = {
      userId: sessionEntity.userId,
      refreshToken: sessionEntity.refreshToken,
      expiresAt: sessionEntity.expiresAt,
      revoked: sessionEntity.revoked,
      createdAt: sessionEntity.createdAt,
    };
    await UserSessionModel.findOneAndUpdate(
      { refreshToken: sessionEntity.refreshToken },
      dataToSave,
      { upsert: true, new: true }
    );
  }

  async findByRefreshToken(token) {
    const sessionDoc = await UserSessionModel.findOne({
      refreshToken: token,
    }).lean();
    return this._toDomain(sessionDoc);
  }
  
  async deleteByRefreshToken(token) {
    await UserSessionModel.deleteOne({ refreshToken: token });
  }

  async deleteAllByUserId(userId) {
    await UserSessionModel.deleteMany({ userId: userId });
  }
}

module.exports = MongoUserSessionRepository;