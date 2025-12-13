class Contact {
  constructor({ type, value, isPrimary = false }) {
    if (!type || typeof type !== 'string') {
      throw new Error('Contact type is required');
    }
    if (!value || typeof value !== 'string') {
      throw new Error('Contact value is required');
    }
    this.type = type;
    this.value = value;
    this.isPrimary = Boolean(isPrimary);

    Object.freeze(this);
  }
}
module.exports = Contact;