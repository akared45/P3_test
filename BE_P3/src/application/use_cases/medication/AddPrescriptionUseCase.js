class AddPrescriptionUseCase {
    constructor({ appointmentRepository, medicationRepository, medicalSafetyService }) {
        this.appointmentRepository = appointmentRepository;
        this.medicationRepository = medicationRepository;
        this.medicalSafetyService = medicalSafetyService;
    }

    async execute(request) {
        const appointment = await this.appointmentRepository.findById(request.appointmentId);
        const medication = await this.medicationRepository.findById(request.medicationId);

        if (!appointment || !medication) {
            throw new Error("Data not found");
        }

        const patientProfile = await this.appointmentRepository.getPatientProfile(appointment.patientId);

        const safetyResult = this.medicalSafetyService.checkSafety(medication, patientProfile);

        if (!safetyResult.isSafe) {
            return {
                success: false,
                warnings: safetyResult.warnings
            };
        }

        const prescriptionItem = {
            medicationId: medication.id,
            medicationCode: medication.code,
            drugName: medication.name,
            dosage: request.dosage,
            duration: request.duration,
            instructions: `${request.timing}. ${request.note || ''}`
        };

        await this.appointmentRepository.addPrescription(appointment.id, prescriptionItem);

        return {
            success: true,
            message: "Prescription successfully created"
        };
    }
}
module.exports = AddPrescriptionUseCase;