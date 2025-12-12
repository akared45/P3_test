const { NotImplementedException } = require('../exceptions');

class IUserRepository {
    async save(user) {
        throw new NotImplementedException('save');
    }

    async delete(id) {
        throw new NotImplementedException('delete');
    }

    async findByEmail(email) {
        throw new NotImplementedException('findByEmail');
    }

    async findById(id) {
        throw new NotImplementedException('findById');
    }

    async findAllByUserType(userType, options = {}) {
        throw new NotImplementedException('findAllByUserType');
    }

    async search(keyword) {
        throw new NotImplementedException('search');
    }
}

module.exports = IUserRepository;