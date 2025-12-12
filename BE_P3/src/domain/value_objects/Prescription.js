class Prescription {
  constructor({ medicationCode, dosage, frequency, duration, instructions = '' }) {
    if (!medicationCode) throw new Error('Medication code required');
    this.medicationCode = medicationCode;
    this.dosage = dosage?.trim() || '';
    this.frequency = frequency?.trim() || '';
    this.duration = duration?.trim() || '';
    this.instructions = instructions?.trim() || '';
    Object.freeze(this);
  }
}
module.exports = Prescription;