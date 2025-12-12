const User = require("../../../../domain/entities/User");
const Patient = require("../../../../domain/entities/Patient");
const Doctor = require("../../../../domain/entities/Doctor");
const { UserType } = require("../../../../domain/enums");

class UserMapper {
  static toDomain(rawDoc) {
    if (!rawDoc) return null;

    const baseData = {
      id: rawDoc._id || rawDoc.userId,
      username: rawDoc.username,
      email: rawDoc.email,
      passwordHash: rawDoc.passwordHash,
      userType: rawDoc.userType,
      isActive: rawDoc.isActive,
      createdAt: rawDoc.createdAt,
      profile: rawDoc.profile,
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
          specCode: rawDoc.specCode
        });

      default:
        return new User(baseData);
    }
  }

  static toPersistence(entity) {
    const data = {
      _id: entity.id.toString(),
      username: entity.username,
      email: entity.email,
      passwordHash: entity.passwordHash,
      userType: entity.userType,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      profile: entity.profile,
    };

    if (entity instanceof Patient) {
      data.contacts = entity.contacts;
      data.medicalConditions = entity.medicalConditions;
      data.allergies = entity.allergies;
    } else if (entity instanceof Doctor) {
      data.licenseNumber = entity.licenseNumber;
      data.specCode = entity.specCode;
    }

    return data;
  }
}

module.exports = UserMapper;