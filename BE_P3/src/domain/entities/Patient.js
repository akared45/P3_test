const User = require('./User');
const { Contact, MedicalCondition, Allergy } = require('../value_objects');
const { UserType } = require('../enums');

class Patient extends User {
  constructor(data) {
    super({
      ...data,
      userType: UserType.PATIENT,
      profile: data.profile || {}
    });

    this.contacts = (data.contacts || []).map(c => c instanceof Contact ? c : new Contact(c));
    this.medicalConditions = (data.medicalConditions || []).map(m => m instanceof MedicalCondition ? m : new MedicalCondition(m));
    this.allergies = (data.allergies || []).map(a => a instanceof Allergy ? a : new Allergy(a));

    Object.freeze(this);
  }

  getPrimaryPhone() {
    return this.contacts.find(c => c.type === 'phone' && c.isPrimary)?.value || null;
  }

  hasAllergyTo(medName) {
    return this.allergies.some(a => a.name.toLowerCase().includes(medName.toLowerCase()));
  }

  updateProfile(newProfileData) {
    return new Patient({
      ...this,
      profile: {
        ...this.profile,
        ...newProfileData
      }
    });
  }

  updateContactInfo(phone, address) {
    let newContacts = [...this.contacts];

    if (phone) {
      newContacts = newContacts.filter(c => c.type !== 'phone');
      newContacts.push(new Contact({ type: 'phone', value: phone, isPrimary: true }));
    }

    if (address) {
      newContacts = newContacts.filter(c => c.type !== 'address');
      newContacts.push(new Contact({ type: 'address', value: address, isPrimary: true }));
    }

    return new Patient({
      ...this,
      contacts: newContacts
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