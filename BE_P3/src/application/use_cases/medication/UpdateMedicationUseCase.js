const medicationPolicy = require("../../../domain/policies/MedicationPolicy");
const { Action } = require("../../../domain/enums");

class UpdateMedicationUseCase {
    constructor({ medicationRepository }) {
        this.medicationRepository = medicationRepository;
    }

    async execute(actor, id, updateMedicationDto) {
        if (!medicationPolicy.can(actor, Action.UPDATE)) {
            throw new Error("Unauthorized: You do not have permission to update medication information");
        }

        const medication = await this.medicationRepository.findById(id);
        if (!medication) throw new Error("Medication not found");

        const updatedData = {
            ...medication,
            ...updateMedicationDto,
            code: medication.code,
        };

        return await this.medicationRepository.save(updatedData);
    }
}

module.exports = UpdateMedicationUseCase;
