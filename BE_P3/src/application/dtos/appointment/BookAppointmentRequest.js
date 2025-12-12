class BookAppointmentRequest {
  constructor({ patientId, doctorId, appointmentDate, symptoms, type }) {
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.appointmentDate = appointmentDate;
    this.symptoms = symptoms;
    this.type = type;
  }
}
module.exports = BookAppointmentRequest;