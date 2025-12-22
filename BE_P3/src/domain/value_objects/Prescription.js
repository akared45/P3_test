class Prescription {
  constructor({ medicationId, drugName, quantity, usage, dosage, duration }) {
    this.medicationId = medicationId;
    this.drugName = drugName;
    this.quantity = quantity;
    this.usage = usage;
    this.dosage = dosage;
    this.duration = duration;
    Object.freeze(this);
  }
}

module.exports = Prescription;