const IVerificationTokenRepository = require("../../../../domain/repositories/IVerificationTokenRepository");
const VerificationTokenModel = require("../models/VerificationTokenModel");
const VerificationTokenMapper = require("../mappers/VerificationTokenMapper");

class MongoVerificationTokenRepository extends IVerificationTokenRepository {

    async save(tokenEntity) {
        const data = VerificationTokenMapper.toPersistence(tokenEntity);
        const savedDoc = await VerificationTokenModel.create(data);
        return VerificationTokenMapper.toDomain(savedDoc.toObject());
    }

    async findByTokenAndType(tokenValue, type) {
        
        const doc = await VerificationTokenModel.findOne({
            token: tokenValue,
            type: type,
            expiresAt: { $gt: new Date() }
        }).lean();

        return VerificationTokenMapper.toDomain(doc);
    }

    async delete(tokenValue) {
        await VerificationTokenModel.deleteOne({ token: tokenValue });
    }

    async deleteAllByUserId(userId, type) {
        await VerificationTokenModel.deleteMany({ userId, type });
    }
}

module.exports = MongoVerificationTokenRepository;