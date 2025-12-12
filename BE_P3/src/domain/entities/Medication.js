class Medication {
  constructor({ code, name, generic, drugClass, commonDosage }) {
    this.code = code;
    this.name = name;
    this.generic = generic;
    this.drugClass = drugClass;
    this.commonDosage = commonDosage;
    Object.freeze(this);
  }
}
module.exports = Medication;