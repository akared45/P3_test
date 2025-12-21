const Medication = require('../../../domain/entities/Medication');
const medicationPolicy = require('../../../domain/policies/MedicationPolicy');
const { Action } = require('../../../domain/enums');

class CreateMedicationUseCase {
    constructor({ medicationRepository }) {
        this.medicationRepository = medicationRepository;
    }

    async execute(actor, createMedicationDto) {
        if (!medicationPolicy.can(actor, Action.CREATE)) {
            throw new Error("Unauthorized: Bạn không có quyền thêm thuốc vào danh mục");
        }

        const existing = await this.medicationRepository.findByCode(createMedicationDto.code);
        if (existing) throw new Error(`Mã thuốc ${createMedicationDto.code} đã tồn tại`);

        const medication = new Medication(createMedicationDto);

        return await this.medicationRepository.save(medication);
    }
}

module.exports = CreateMedicationUseCase;