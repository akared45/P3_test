const User = require("../../../../domain/entities/User");
const Patient = require("../../../../domain/entities/Patient");
const Doctor = require("../../../../domain/entities/Doctor");
const { UserType } = require("../../../../domain/enums");

class UserMapper {
  static toDomain(rawDoc) {
    if (!rawDoc) return null;
    const baseData = {
      id: rawDoc._id,
      username: rawDoc.username,
      email: rawDoc.email,
      passwordHash: rawDoc.passwordHash,
      userType: rawDoc.userType,
      isActive: rawDoc.isActive,
      isEmailVerified: rawDoc.isEmailVerified,
      isDeleted: rawDoc.isDeleted,
      deletedAt: rawDoc.deletedAt,
      createdAt: rawDoc.createdAt,
      profile: {
        fullName: rawDoc.profile?.fullName,
        dateOfBirth: rawDoc.profile?.dateOfBirth,
        gender: rawDoc.profile?.gender,
        avatarUrl: rawDoc.profile?.avatarUrl
      },
    };

    switch (rawDoc.userType) {
      case UserType.PATIENT:
        return new Patient({
          ...baseData,
          contacts: rawDoc.contacts || [],
          medicalConditions: rawDoc.medicalConditions || [],
          allergies: rawDoc.allergies || []
        });

      case UserType.DOCTOR:
        return new Doctor({
          ...baseData,
          licenseNumber: rawDoc.licenseNumber,
          specializationId: rawDoc.specializationId || rawDoc.specCode,
          bio: rawDoc.bio,
          rating: rawDoc.rating,
          schedules: rawDoc.schedules || []
        });

      default:
        return new User(baseData);
    }
  }

  static toPersistence(entity) {
    const data = {
      _id: entity.id.value || entity.id.toString(),
      username: entity.username,
      email: entity.email,
      passwordHash: entity.passwordHash,
      userType: entity.userType,
      isActive: entity.isActive,
      isEmailVerified: entity.isEmailVerified,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      profile: {
        fullName: entity.profile.fullName,
        dateOfBirth: entity.profile.dateOfBirth,
        gender: entity.profile.gender,
        avatarUrl: entity.profile.avatarUrl
      },
    };

    if (entity instanceof Patient) {
      data.contacts = entity.contacts?.map(c => ({
        type: c.type,
        value: c.value,
        isPrimary: c.isPrimary
      })) || [];

      data.medicalConditions = entity.medicalConditions;
      data.allergies = entity.allergies;
    }
    else if (entity instanceof Doctor) {
      data.licenseNumber = entity.licenseNumber;
      data.specializationId = entity.specializationId;
      data.bio = entity.bio;
      data.schedules = entity.schedules;
    }

    return data;
  }
}

module.exports = UserMapper;