class Prescription {
  constructor({
    drugName,
    quantity,
    usage,
    medicationCode = null,
    instructions = ''
  }) {
    if (!drugName) throw new Error('Tên thuốc (drugName) là bắt buộc');
    if (!quantity) throw new Error('Số lượng (quantity) là bắt buộc');
    if (!usage) throw new Error('Cách dùng (usage) là bắt buộc');
    this.drugName = drugName.trim();
    this.quantity = quantity.toString().trim();
    this.usage = usage.trim();
    this.medicationCode = medicationCode || null;
    this.instructions = instructions;
    Object.freeze(this);
  }
}

module.exports = Prescription;