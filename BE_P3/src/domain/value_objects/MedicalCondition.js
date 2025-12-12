const MedicalConditionStatus = require('../enums/MedicalConditionStatus');

class MedicalCondition {
  constructor({ name, diagnosedDate, status = 'chronic', treatmentPlan = '', notes = '' }) {
    if (!name) throw new Error('Medical condition name is required');
    this.name = name.trim();
    this.diagnosedDate = diagnosedDate ? new Date(diagnosedDate) : new Date();
    this.status = Object.values(MedicalConditionStatus).includes(status) ? status : MedicalConditionStatus.CHRONIC;
    this.treatmentPlan = treatmentPlan?.trim() || '';
    this.notes = notes?.trim() || '';
    Object.freeze(this);
  }
}
module.exports = MedicalCondition;