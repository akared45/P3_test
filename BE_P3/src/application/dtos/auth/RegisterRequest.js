const { ValidationException } = require('../../../domain/exceptions');

class RegisterRequest {
  constructor(data) {
    if (!data.email || !data.password) {
      throw new ValidationException('Email and password are required');
    }
    this.email = data.email.trim().toLowerCase();
    this.password = data.password;
    this.username = data.username ? data.username.trim() : null;
    this.userType = data.userType;
    const profile = data.profile || {};
    this.profile = {
      fullName: profile.fullName ? profile.fullName.trim() : '',
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
      gender: profile.gender,
      avatarUrl: profile.avatarUrl || null
    };
  }
}

module.exports = RegisterRequest;