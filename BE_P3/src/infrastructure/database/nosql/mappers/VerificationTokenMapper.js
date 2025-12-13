const VerificationToken = require("../../../../domain/entities/VerificationToken");

class VerificationTokenMapper {
    static toDomain(doc) {
        if (!doc) return null;
        return new VerificationToken({
            userId: doc.userId,
            token: doc.token,
            type: doc.type,
            expiresAt: doc.expiresAt,
            createdAt: doc.createdAt
        });
    }

    static toPersistence(entity) {
        return {
            userId: entity.userId,
            token: entity.token,
            type: entity.type,
            expiresAt: entity.expiresAt,
            createdAt: entity.createdAt
        };
    }
}

module.exports = VerificationTokenMapper;