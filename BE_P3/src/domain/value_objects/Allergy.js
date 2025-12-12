const AllergySeverity = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  LIFE_THREATENING: 'life_threatening'
});

class Allergy {
  constructor({ name, severity = 'medium', reaction = '', notes = '' }) {
    if (!name) throw new Error('Allergy name is required');
    this.name = name.trim();
    this.severity = Object.values(AllergySeverity).includes(severity) ? severity : AllergySeverity.MEDIUM;
    this.reaction = reaction?.trim() || '';
    this.notes = notes?.trim() || '';
    Object.freeze(this);
  }
}
Allergy.Severity = AllergySeverity;
module.exports = Allergy;