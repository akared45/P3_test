const IMedicationRepository = require("../../../../domain/repositories/IMedicationRepository");
const MedicationModel = require("../models/MedicationModel");
const MedicationMapper = require("../mappers/MedicationMapper");

class MongoMedicationRepository extends IMedicationRepository {
  async findById(id) {
    const doc = await MedicationModel.findOne({
      _id: id,
      isDeleted: { $ne: true },
    }).lean();

    return MedicationMapper.toDomain(doc);
  }

  async findByCode(code) {
    const doc = await MedicationModel.findOne({
      code: code,
      isDeleted: { $ne: true },
    }).lean();

    return MedicationMapper.toDomain(doc);
  }

  async findAll(filters = {}) {
    const query = { isDeleted: { $ne: true } };

    if (filters.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }
    if (filters.drugClass) {
      query.drugClass = filters.drugClass;
    }

    const docs = await MedicationModel.find(query).lean();
    return docs.map((doc) => MedicationMapper.toDomain(doc));
  }

  async save(medicationEntity) {
    const persistenceData = MedicationMapper.toPersistence(medicationEntity);
    const query = medicationEntity.id
      ? { _id: medicationEntity.id }
      : { code: persistenceData.code };

    const savedDoc = await MedicationModel.findOneAndUpdate(
      query,
      { $set: persistenceData },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    ).lean();

    return MedicationMapper.toDomain(savedDoc);
  }

  async delete(id) {
    return await MedicationModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );
  }
}

module.exports = MongoMedicationRepository;
