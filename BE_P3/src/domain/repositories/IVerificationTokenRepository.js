const { NotImplementedException } = require('../exceptions');

class IVerificationTokenRepository {
    async save(tokenEntity) {
        throw new NotImplementedException('IVerificationTokenRepository.save');
    }

    async findByTokenAndType(tokenValue, type) {
        throw new NotImplementedException('IVerificationTokenRepository.findByTokenAndType');
    }

    async delete(tokenValue) {
        throw new NotImplementedException('IVerificationTokenRepository.delete');
    }

    async deleteAllByUserId(userId, type) {
        throw new NotImplementedException('IVerificationTokenRepository.deleteAllByUserId');
    }
}

module.exports = IVerificationTokenRepository;