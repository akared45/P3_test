const IUserRepository = require("../../../../domain/repositories/IUserRepository");
const { UserModel, PatientModel, DoctorModel } = require("../models/UserModel");
const User = require("../../../../domain/entities/User");
const Patient = require("../../../../domain/entities/Patient");
const Doctor = require("../../../../domain/entities/Doctor");
const { UserType } = require("../../../../domain/enums");
const SpecializationModel = require("../models/SpecializationModel");

class MongoUserRepository extends IUserRepository {
    _toDomain(doc) {
        if (!doc) return null;
        const baseData = {
            id: doc._id,
            username: doc.username,
            email: doc.email,
            passwordHash: doc.passwordHash,
            userType: doc.userType,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            profile: doc.profile,
            isDeleted: doc.isDeleted || false,
            deletedAt: doc.deletedAt || null
        };

        switch (doc.userType) {
            case UserType.PATIENT:
                return new Patient({
                    ...baseData,
                    contacts: doc.contacts || [],
                    medicalConditions: doc.medicalConditions || [],
                    allergies: doc.allergies || []
                });

            case UserType.DOCTOR:
                const specName = (doc.specCode && doc.specCode.name) ? doc.specCode.name : '';
                const specCodeValue = (doc.specCode && doc.specCode._id) ? doc.specCode._id : doc.specCode;
                return new Doctor({
                    ...baseData,
                    licenseNumber: doc.licenseNumber,
                    specCode: specCodeValue,
                    specializationName: specName,
                    bio: doc.bio || '',
                    rating: doc.rating || 0,
                    reviewCount: doc.reviewCount || 0,
                    timeZone: doc.timeZone,
                    qualifications: doc.qualifications || [],
                    workHistory: doc.workHistory || [],
                    schedules: doc.schedules || [],
                    unavailableDates: doc.unavailableDates || []
                });

            default:
                return new User(baseData);
        }
    }

    _toPersistence(entity) {
        const data = {
            _id: entity.id.toString(),
            username: entity.username,
            email: entity.email,
            passwordHash: entity.passwordHash,
            userType: entity.userType,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            profile: entity.profile,
            isDeleted: entity.isDeleted,
            deletedAt: entity.deletedAt,
        };

        if (entity.userType === UserType.PATIENT) {
            data.contacts = entity.contacts;
            data.medicalConditions = entity.medicalConditions;
            data.allergies = entity.allergies;
        }
        else if (entity.userType === UserType.DOCTOR) {
            data.licenseNumber = entity.licenseNumber;
            data.specCode = entity.specCode;
            data.bio = entity.bio;
            data.rating = entity.rating;
            data.reviewCount = entity.reviewCount;
            data.timeZone = entity.timeZone;
            data.qualifications = entity.qualifications;
            data.workHistory = entity.workHistory;
            data.schedules = entity.schedules;
            data.unavailableDates = entity.unavailableDates;
        }

        return data;
    }

    async findById(id) {
        const doc = await UserModel.findById(id).populate('specCode').lean();
        return this._toDomain(doc);
    }

    async findByEmail(email) {
        const doc = await UserModel.findOne({
            email: email,
            isDeleted: false
        }).lean();
        return this._toDomain(doc);
    }

    async delete(id) {
        await UserModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false
        });
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
            .populate('specCode')
            .lean();
        return docs.map(doc => this._toDomain(doc));
    }

    async save(userEntity) {
        const data = this._toPersistence(userEntity);
        let ModelToUse = UserModel;
        if (data.userType === UserType.PATIENT) {
            ModelToUse = PatientModel;
        } else if (data.userType === UserType.DOCTOR) {
            ModelToUse = DoctorModel;
        }
        const updatedDoc = await ModelToUse.findByIdAndUpdate(
            data._id,
            data,
            { upsert: true, new: true }
        ).lean();
        return this._toDomain(updatedDoc);
    }
}

module.exports = MongoUserRepository;