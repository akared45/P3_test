const ISpecializationRepository = require('../../../../domain/repositories/ISpecializationRepository');
const SpecializationModel = require('../models/SpecializationModel');
const Specialization = require('../../../../domain/entities/Specialization');

class MongoSpecializationRepository extends ISpecializationRepository {

    _toDomain(doc) {
        if (!doc) return null;
        return new Specialization({
            code: doc._id,
            name: doc.name,
            category: doc.category,
            isDeleted: doc.isDeleted,
            isDeleted: doc.isDeleted,
        });
    }

    _toPersistence(entity) {
        return {
            _id: entity.code,
            name: entity.name,
            category: entity.category,
            isDeleted: entity.isDeleted
        };
    }

    async findAll() {
        const docs = await SpecializationModel.find({ isDeleted: false })
            .sort({ name: 1 })
            .lean();
        return docs.map(doc => this._toDomain(doc));
    }

    async findById(code) {
        const doc = await SpecializationModel.findOne({
            _id: code,
            isDeleted: false
        }).lean();

        return this._toDomain(doc);
    }

    async create(specializationEntity) {
        const data = this._toPersistence(specializationEntity);
        const newDoc = await SpecializationModel.create(data);
        return this._toDomain(newDoc);
    }

    async update(specializationEntity) {
        const data = this._toPersistence(specializationEntity);
        await SpecializationModel.findByIdAndUpdate(
            data._id,
            {
                name: data.name,
                category: data.category
            }
        );
    }

    async delete(code) {
        await SpecializationModel.findByIdAndUpdate(code, {
            isDeleted: true,
            deletedAt: new Date()
        });
    }
}

module.exports = MongoSpecializationRepository;