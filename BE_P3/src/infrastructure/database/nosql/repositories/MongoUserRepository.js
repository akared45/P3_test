const IUserRepository = require("../../../../domain/repositories/IUserRepository");
const { UserModel, PatientModel, DoctorModel } = require("../models/UserModel");
const { UserType } = require("../../../../domain/enums");
const UserMapper = require("../mappers/UserMapper");

class MongoUserRepository extends IUserRepository {
    async findById(id) {
        const doc = await UserModel.findById(id)
            .populate('specCode', 'name')
            .lean();
        return UserMapper.toDomain(doc);

    }

    async findByEmail(email) {
        const doc = await UserModel.findOne({
            email: email,
            isDeleted: false
        }).lean();
        return UserMapper.toDomain(doc);
    }

    async findAllByUserType(userType, options = {}) {
        const { limit = 10, skip = 0 } = options;

        const docs = await UserModel.find({
            userType: userType,
            isDeleted: false
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('specCode', 'name')
            .lean();
        return docs.map(doc => UserMapper.toDomain(doc));
    }

    async save(userEntity) {
        const data = UserMapper.toPersistence(userEntity);

        let ModelToUse = UserModel;
        if (data.userType === UserType.PATIENT) {
            ModelToUse = PatientModel;
        } else if (data.userType === UserType.DOCTOR) {
            ModelToUse = DoctorModel;
        }

        const isDoctor = data.userType === UserType.DOCTOR;
        let query = ModelToUse.findByIdAndUpdate(
            data._id,
            data,
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );
        if (isDoctor) {
            query = query.populate('specCode', 'name');
        }
        const updatedDoc = await query.lean();
        return UserMapper.toDomain(updatedDoc);
    }

    async delete(id) {
        await UserModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false
        });
    }
}

module.exports = MongoUserRepository;