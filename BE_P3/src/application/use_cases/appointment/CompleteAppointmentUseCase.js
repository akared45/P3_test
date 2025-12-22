const { format } = require("date-fns");

class CompleteAppointmentUseCase {
  constructor({ appointmentRepository, userRepository, emailService }) {
    this.appointmentRepository = appointmentRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async execute(request) {
    const { userId, appointmentId, doctorNotes, symptoms, prescriptions } =
      request;

    const appointment = await this.appointmentRepository.findById(
      appointmentId
    );
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.doctorId.toString() !== userId) {
      throw new Error("You are not authorized to complete this appointment");
    }

    const completedAppointment = appointment.complete(
      doctorNotes,
      prescriptions,
      symptoms
    );

    await this.appointmentRepository.save(completedAppointment);

    const patient = await this.userRepository.findById(
      completedAppointment.patientId
    );

    if (patient && patient.email) {
      const dateStr = format(new Date(), "dd/MM/yyyy HH:mm");

      this.emailService.sendPrescriptionEmail(patient.email, {
        patientName: patient.profile?.fullName || patient.username,
        doctorName: completedAppointment.doctorName,
        date: dateStr,
        symptoms: completedAppointment.symptoms,
        doctorNotes: completedAppointment.doctorNotes,
        prescriptions: prescriptions,
      });
    }

    return completedAppointment;
  }
}

module.exports = CompleteAppointmentUseCase;
