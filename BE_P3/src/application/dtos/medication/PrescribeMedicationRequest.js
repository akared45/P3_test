class PrescribeMedicationRequest {
    constructor({ appointmentId, medicationId, dosage, duration, timing, note }) {
        if (!appointmentId || !medicationId) throw new Error("Thiếu ID cuộc hẹn hoặc thuốc");
        this.appointmentId = appointmentId;
        this.medicationId = medicationId;
        this.dosage = dosage; 
        this.duration = duration;
        this.timing = timing;
        this.note = note;
    }
}