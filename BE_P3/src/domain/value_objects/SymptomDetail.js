const SymptomSeverity = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  VERY_HIGH: 'very_high'
});

class SymptomDetail {
  constructor({ name, severity = 'medium' }) {
    if (!name) throw new Error('Symptom name required');
    this.name = name.trim();
    this.severity = Object.values(SymptomSeverity).includes(severity) ? severity : SymptomSeverity.MEDIUM;
    Object.freeze(this);
  }
}
SymptomDetail.Severity = SymptomSeverity;
module.exports = SymptomDetail;