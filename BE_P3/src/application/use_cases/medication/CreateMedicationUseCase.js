const Medication = require('../../../domain/entities/Medication');
const medicationPolicy = require('../../../domain/policies/MedicationPolicy');
const { Action } = require('../../../domain/enums');

class CreateMedicationUseCase {
    constructor({ medicationRepository }) {
        this.medicationRepository = medicationRepository;
    }

    async execute(actor, createMedicationDto) {
        if (!medicationPolicy.can(actor, Action.CREATE)) {
            throw new Error("Unauthorized: You do not have permission to add medication to the catalog");
        }

        const existing = await this.medicationRepository.findByCode(createMedicationDto.code);
        if (existing) throw new Error(`Medication code ${createMedicationDto.code} already exists`);

        const medication = new Medication(createMedicationDto);

        return await this.medicationRepository.save(medication);
    }
}

module.exports = CreateMedicationUseCase;