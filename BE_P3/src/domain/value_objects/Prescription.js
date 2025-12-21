class PrescriptionItem {
  constructor({
    medicationId,
    drugName,
    dosage,
    timing,
    duration,
    note
  }) {
    this.medicationId = medicationId;
    this.drugName = drugName;
    this.dosage = dosage;
    this.timing = timing;
    this.duration = duration;
    this.note = note;

    Object.freeze(this);
  }
}

module.exports = PrescriptionItem;