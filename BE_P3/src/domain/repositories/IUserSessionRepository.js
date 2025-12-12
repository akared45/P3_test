const NotImplementedException = require('../exceptions');

class IUserSessionRepository {
    async save(session) {
        throw new NotImplementedException('save');
    }

    async findByRefreshToken(refreshToken) {
        throw new NotImplementedException('findByRefreshToken');
    }

    async deleteByRefreshToken(refreshToken) {
        throw new NotImplementedException('deleteByRefreshToken');
    }

    async deleteAllByUserId(userId) {
        throw new NotImplementedException('deleteAllByUserId');
    }
}

module.exports = IUserSessionRepository;