const medicationPolicy = require('../../../domain/policies/MedicationPolicy');
const { Action } = require('../../../domain/enums');

class UpdateMedicationUseCase {
    constructor({ medicationRepository }) {
        this.medicationRepository = medicationRepository;
    }

    async execute(actor, id, updateMedicationDto) {
        if (!medicationPolicy.can(actor, Action.UPDATE)) {
            throw new Error("Unauthorized: Bạn không có quyền sửa thông tin thuốc");
        }

        const medication = await this.medicationRepository.findById(id);
        if (!medication) throw new Error("Không tìm thấy thuốc cần cập nhật");

        const updatedData = {
            ...medication,
            ...updateMedicationDto,
            code: medication.code
        };

        return await this.medicationRepository.save(updatedData);
    }
}

module.exports = UpdateMedicationUseCase;