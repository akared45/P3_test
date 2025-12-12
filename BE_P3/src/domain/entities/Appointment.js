const { AppointmentStatus, AppointmentType } = require('../enums');
const { SymptomDetail, Prescription } = require('../value_objects');

class Appointment {
  constructor({
    id,
    patientId,
    patientName,
    patientAvatar,
    doctorId,
    doctorName,
    doctorAvatar,
    type = AppointmentType.CHAT,
    appointmentDate,
    durationMinutes = 30,
    status = AppointmentStatus.PENDING,
    symptoms = '',
    doctorNotes = '',
    createdAt = new Date(),
    symptomDetails = [],
    prescriptions = []
  }) {
    if (!patientId) throw new Error("Appointment must have a patient");
    if (!doctorId) throw new Error("Appointment must have a doctor");
    if (!appointmentDate) throw new Error("Appointment date is required");
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.type = type;
    this.appointmentDate = new Date(appointmentDate);
    this.durationMinutes = Number(durationMinutes);
    this.patientName = patientName;
    this.patientAvatar = patientAvatar;
    this.doctorName = doctorName;
    this.doctorAvatar = doctorAvatar;
    this.status = status;
    this.symptoms = symptoms?.trim() || '';
    this.doctorNotes = doctorNotes?.trim() || '';
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.symptomDetails = (symptomDetails || []).map(s => new SymptomDetail(s));
    this.prescriptions = (prescriptions || []).map(p => new Prescription(p));
    Object.freeze(this);
  }

  isConfirmed() {
    return this.status === AppointmentStatus.CONFIRMED;
  }

  canBeCancelled() {
    return this.status === AppointmentStatus.PENDING || this.status === AppointmentStatus.CONFIRMED;
  }

  confirm() {
    if (this.status !== AppointmentStatus.PENDING) {
      throw new Error("Only pending appointments can be confirmed");
    }
    return new Appointment({ ...this, status: AppointmentStatus.CONFIRMED });
  }

  cancel(reason) {
    if (!this.canBeCancelled()) {
      throw new Error("Cannot cancel this appointment");
    }
    return new Appointment({
      ...this,
      status: AppointmentStatus.CANCELLED,
      doctorNotes: reason ? `Cancelled: ${reason}` : this.doctorNotes
    });
  }

  complete(notes = '', prescriptions = []) {
    if (this.status !== AppointmentStatus.CONFIRMED && this.status !== AppointmentStatus.IN_PROGRESS) {
      throw new Error("Appointment must be confirmed or in-progress to complete");
    }
    return new Appointment({
      ...this,
      status: AppointmentStatus.COMPLETED,
      doctorNotes: notes,
      prescriptions: prescriptions.map(p => new Prescription(p))
    });
  }

  hasParticipant(userId) {
    return String(this.patientId) === String(userId) ||
      String(this.doctorId) === String(userId);
  }
}

module.exports = Appointment;