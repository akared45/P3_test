const { UserId, Contact } = require('../value_objects');
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
        contacts = [],
        isDeleted = false,
        deletedAt = null,
        isEmailVerified = false
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
        this.contacts = (contacts || []).map(c => 
            c instanceof Contact ? c : new Contact(c)
        );
        this.isDeleted = Boolean(isDeleted);
        this.deletedAt = deletedAt ? new Date(deletedAt) : null;
        this.isEmailVerified = Boolean(isEmailVerified);
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
        const Constructor = this.constructor;
        return new Constructor({ ...this, isActive: false });
    }

    isAvailable() {
        return this.isActive && !this.isDeleted;
    }

    getContactByType(type) {
        if (!this.contacts || this.contacts.length === 0) return null;
        const primary = this.contacts.find(c => c.type === type && c.isPrimary);
        if (primary) return primary.value;
        const any = this.contacts.find(c => c.type === type);
        return any ? any.value : null;
    }

    verifyEmail() {
        if (this.isEmailVerified) return this;
        const Constructor = this.constructor;

        return new Constructor({
            ...this,
            isEmailVerified: true
        });
    }

    updatePasswordHash(newPasswordHash) {
        if (!newPasswordHash || typeof newPasswordHash !== 'string') {
            throw new Error('User: Password hash must be a valid string.');
        }

        const Constructor = this.constructor;
        return new Constructor({
            ...this,
            passwordHash: newPasswordHash
        });
    }
}

module.exports = User;