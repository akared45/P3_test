const IUserSessionRepository = require("../../../../domain/repositories/IUserSessionRepository");
const UserSessionModel = require("../models/UserSessionModel");
const UserSessionMapper = require("../mappers/UserSessionMapper");

class MongoUserSessionRepository extends IUserSessionRepository {
  async save(sessionEntity) {
    const dataToSave = UserSessionMapper.toPersistence(sessionEntity);
    await UserSessionModel.findOneAndUpdate(
      { refreshToken: dataToSave.refreshToken },
      dataToSave,
      { upsert: true, new: true }
    );
  }

  async findByRefreshToken(token) {
    const sessionDoc = await UserSessionModel.findOne({
      refreshToken: token,
    }).lean();
    return UserSessionMapper.toDomain(sessionDoc);
  }

  async deleteByRefreshToken(token) {
    await UserSessionModel.deleteOne({ refreshToken: token });
  }

  async deleteByUserId(userId) {
    await UserSessionModel.deleteMany({ userId: userId });
  }
}

module.exports = MongoUserSessionRepository;