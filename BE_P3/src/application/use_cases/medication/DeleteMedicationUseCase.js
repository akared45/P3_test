const medicationPolicy = require("../../../domain/policies/MedicationPolicy");
const { Action } = require("../../../domain/enums");

class DeleteMedicationUseCase {
  constructor({ medicationRepository, appointmentRepository }) {
    this.medicationRepository = medicationRepository;
    this.appointmentRepository = appointmentRepository;
  }

  async execute(actor, id) {
    if (!medicationPolicy.can(actor, Action.DELETE)) {
      throw new Error("Unauthorized");
    }

    const medication = await this.medicationRepository.findById(id);
    if (!medication)
      throw new Error("Medication does not exist or has already been deleted");

    await this.medicationRepository.delete(id);

    return {
      success: true,
      message: "Medication has been removed from the active catalog",
    };
  }
}

module.exports = DeleteMedicationUseCase;
