class MedicalSafetyService {
  checkSafety(medication, patientProfile) {
    const warnings = [];

    const allergens = medication?.allergens || [];
    const contraindications = medication?.contraindications || [];
    const patientAllergies = patientProfile?.allergies || [];

    const isAllergic = allergens.some(allergen =>
      patientAllergies.includes(allergen)
    );
    
    if (isAllergic) {
      warnings.push(`Warning: The patient has a history of allergy to ingredients in ${medication.genericName || 'this medication'}`);
    }

    if (patientProfile?.isPregnant && contraindications.includes('pregnant')) {
      warnings.push(`Warning: ${medication.name} is contraindicated for pregnant women`);
    }

    const age = patientProfile?.age || 0;
    if (age < 12 && contraindications.includes('children_under_12')) {
      warnings.push(`Warning: ${medication.name} should not be used in children under 12 years old`);
    }

    return {
      isSafe: warnings.length === 0,
      warnings: warnings
    };
  }
}

module.exports = MedicalSafetyService;
