const Medication = require('../../../../domain/entities/Medication');

class MedicationMapper {
    static toDomain(doc) {
        if (!doc) return null;

        return new Medication({
            id: doc._id,
            code: doc.code,
            name: doc.name,
            genericName: doc.genericName,
            drugClass: doc.drugClass,
            safety: {
                contraindications: doc.safety?.contraindications || [],
                allergens: doc.safety?.allergens || [],
                isPregnancySafe: doc.safety?.isPregnancySafe ?? true
            },
            usage: {
                timing: doc.defaultUsage?.timing || 'ANYTIME',
                instructions: doc.defaultUsage?.instructions || ""
            },
            isDeleted: doc.isDeleted
        });
    }

    static toPersistence(entity) {
        return {
            code: entity.code,
            name: entity.name,
            genericName: entity.genericName,
            drugClass: entity.drugClass,
            safety: {
                contraindications: entity.safety.contraindications,
                allergens: entity.safety.allergens,
                isPregnancySafe: entity.safety.isPregnancySafe
            },
            defaultUsage: {
                timing: entity.usage.timing,
                instructions: entity.usage.instructions
            },
            isDeleted: entity.isDeleted
        };
    }
}

module.exports = MedicationMapper;