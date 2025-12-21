class GetMedicationCatalogUseCase {
    constructor({ medicationRepository }) {
        this.medicationRepository = medicationRepository;
    }

    async execute(filters) {
        return await this.medicationRepository.findAll(filters);
    }
}

module.exports = GetMedicationCatalogUseCase;