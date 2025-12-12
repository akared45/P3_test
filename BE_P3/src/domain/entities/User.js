const { UserId } = require('../value_objects');
const { UserType, Gender } = require('../enums');

class User {
    constructor({
        id, username, email, passwordHash, userType, isActive = true, createdAt = new Date(),
        profile = {
            fullName: '',
            dateOfBirth: null,
            gender: Gender.OTHER,
            avatarUrl: null
        },
        isDeleted = false,
        deletedAt = null
    }) {
        this.id = new UserId(id || require('crypto').randomUUID());
        this.username = username?.trim();
        this.email = email?.trim().toLowerCase();
        this.passwordHash = passwordHash;
        this.userType = userType;
        this.isActive = Boolean(isActive);
        this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
        this.profile = {
            fullName: profile.fullName?.trim() || '',
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
            gender: Object.values(Gender).includes(profile.gender) ? profile.gender : Gender.OTHER,
            avatarUrl: profile.avatarUrl || null
        };
        this.isDeleted = Boolean(isDeleted);
        this.deletedAt = deletedAt ? new Date(deletedAt) : null;
        if (this.constructor === User) {
            Object.freeze(this);
        }
    }
    isPatient() {
        return this.userType === UserType.PATIENT;
    }
    isDoctor() {
        return this.userType === UserType.DOCTOR;
    }
    isAdmin() {
        return this.userType === UserType.ADMIN;
    }
    deactivate() {
        return new User({ ...this, isActive: false });
    }
    isAvailable() {
        return this.isActive && !this.isDeleted;
    }
}
module.exports = User;