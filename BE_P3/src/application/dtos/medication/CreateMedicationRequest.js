class CreateMedicationRequest {
  constructor({ code, name, genericName, drugClass, safety, usage }) {
    if (!code) throw new Error("Medication code is required");
    if (!name) throw new Error("Medication name is required");
    if (!genericName) throw new Error("Generic name is required");

    this.code = code.toUpperCase().trim();
    this.name = name.trim();
    this.genericName = genericName.trim();
    this.drugClass = drugClass || "Unclassified";
    this.safety = {
      contraindications: safety?.contraindications || [],
      allergens: safety?.allergens || [],
      isPregnancySafe: !!safety?.isPregnancySafe
    };
    this.usage = {
      timing: usage?.timing || "ANYTIME",
      instructions: usage?.instructions || ""
    };

    Object.freeze(this);
  }
}

module.exports = CreateMedicationRequest;
