class CompleteAppointmentRequest {
    constructor(data) {
        this.userId = data.userId;
        this.appointmentId = data.appointmentId;
        this.doctorNotes = data.doctorNotes;
        this.symptoms = data.symptoms;
        this.prescriptions = data.prescriptions || [];
    }
}
module.exports = CompleteAppointmentRequest;