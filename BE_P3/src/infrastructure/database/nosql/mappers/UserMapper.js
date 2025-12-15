const User = require("../../../../domain/entities/User");
const Patient = require("../../../../domain/entities/Patient");
const Doctor = require("../../../../domain/entities/Doctor");
const { UserType } = require("../../../../domain/enums");

class UserMapper {
  static toDomain(rawDoc) {
    if (!rawDoc) return null;
    const doc = rawDoc.toObject ? rawDoc.toObject() : rawDoc;
    const baseData = {
      id: doc._id,
      username: doc.username,
      email: doc.email,
      passwordHash: doc.passwordHash,
      userType: doc.userType,
      isActive: doc.isActive,
      isEmailVerified: doc.isEmailVerified,
      isDeleted: doc.isDeleted,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      profile: {
        fullName: doc.profile?.fullName,
        dateOfBirth: doc.profile?.dateOfBirth,
        gender: doc.profile?.gender,
        avatarUrl: doc.profile?.avatarUrl
      },
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
        const isPopulated = typeof doc.specCode === "object" && doc.specCode !== null;
        return new Doctor({
          ...baseData,
          licenseNumber: doc.licenseNumber,
          specCode: isPopulated
            ? doc.specCode._id
            : doc.code,
          specializationName: isPopulated
            ? doc.specCode.name
            : null,
          bio: doc.bio,
          qualifications: doc.qualifications || [],
          workHistory: doc.workHistory || [],
          unavailableDates: doc.unavailableDates || [],
          rating: doc.rating ?? 0,
          schedules: doc.schedules || []
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
      data.specCode = entity.specCode;
      data.bio = entity.bio;
      data.qualifications = entity.qualifications || [];
      data.workHistory = entity.workHistory || [];
      data.unavailableDates = entity.unavailableDates?.map(u => ({
            date: u.date,
            start: u.start,
            end: u.end,
            reason: u.reason,
            allDay: u.allDay
        })) || [];
      data.rating = entity.rating ?? 0;
      data.schedules = entity.schedules || [];
    }

    return data;
  }
}

module.exports = UserMapper;
