class AppointmentResponse {
    constructor(appointmentEntity) {
        this.id = appointmentEntity.id;
        this.status = appointmentEntity.status;
        this.type = appointmentEntity.type;
        this.appointmentDate = appointmentEntity.appointmentDate;
        this.startTime = appointmentEntity.appointmentDate;
        this.durationMinutes = appointmentEntity.durationMinutes;
        this.patient = {
            id: appointmentEntity.patientId,
            name: appointmentEntity.patientName || "Unknown",
            avatar: appointmentEntity.patientAvatar || null
        };

        this.doctor = {
            id: appointmentEntity.doctorId,
            name: appointmentEntity.doctorName || "Unknown",
            avatar: appointmentEntity.doctorAvatar || null
        };

        this.symptoms = appointmentEntity.symptoms;
        this.doctorNotes = appointmentEntity.doctorNotes;
        this.amount = appointmentEntity.amount;
        this.paymentStatus = appointmentEntity.paymentStatus;
        this.paymentMethod = appointmentEntity.paymentMethod;
        this.paymentUrl = appointmentEntity.paymentStatus === 'UNPAID' ? appointmentEntity.paymentUrl : null;
        this.createdAt = appointmentEntity.createdAt;
    }
}

module.exports = AppointmentResponse;