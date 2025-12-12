const { ContactType } = require('../enums');

class Contact {
  constructor({ type, value, isPrimary = false }) {
    if (!Object.values(ContactType).includes(type)) {
      throw new Error(`Contact type must be one of: ${Object.values(ContactType).join(', ')}`);
    }
    if (!value || typeof value !== 'string') {
      throw new Error('Contact value is required and must be string');
    }
    this.type = type;
    this.value = value.trim();
    this.isPrimary = Boolean(isPrimary);
    Object.freeze(this);
  }
}
module.exports = Contact;