const User = require('./User');
const { MedicalCondition, Allergy } = require('../value_objects');
const { UserType } = require('../enums');

class Patient extends User {
  constructor(data) {
    super({
      ...data,
      userType: UserType.PATIENT,
      profile: data.profile || {},
      isEmailVerified: data.isEmailVerified
    });

    this.medicalConditions = (data.medicalConditions || []).map(m =>
      m instanceof MedicalCondition ? m : new MedicalCondition(m)
    );
    this.allergies = (data.allergies || []).map(a =>
      a instanceof Allergy ? a : new Allergy(a)
    );

    Object.freeze(this);
  }

  getPrimaryPhone() {
    return this.getContactByType('phone');
  }

  hasAllergyTo(medName) {
    return this.allergies.some(a => a.name.toLowerCase().includes(medName.toLowerCase()));
  }

  updateProfile(newProfileData) {
    const {
      contacts,
      medicalConditions,
      allergies,
      ...otherProfileData
    } = newProfileData;

    return new Patient({
      ...this,
      contacts: contacts || this.contacts,
      medicalConditions: medicalConditions || this.medicalConditions,
      allergies: allergies || this.allergies,
      profile: {
        ...this.profile,
        ...otherProfileData
      }
    });
  }

  updateMedicalHistory(medicalConditions, allergies) {
    return new Patient({
      ...this,
      medicalConditions: medicalConditions,
      allergies: allergies
    });
  }
}

module.exports = Patient;