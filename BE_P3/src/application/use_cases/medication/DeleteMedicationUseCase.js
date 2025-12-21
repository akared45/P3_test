const medicationPolicy = require('../../../domain/policies/MedicationPolicy');
const { Action } = require('../../../domain/enums');

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
    if (!medication) throw new Error("Thuốc không tồn tại hoặc đã bị xóa trước đó");

    await this.medicationRepository.softDelete(id);

    return { success: true, message: "Thuốc đã được loại bỏ khỏi danh mục hoạt động" };
}
}

module.exports = DeleteMedicationUseCase;