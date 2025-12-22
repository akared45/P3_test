const Appointment = require("../../../domain/entities/Appointment");
const Notification = require("../../../domain/entities/Notification");
const NotificationType = require("../../../domain/enums");
const { BusinessRuleException } = require("../../../domain/exceptions");

class BookAppointmentUseCase {
  constructor({
    appointmentRepository,
    userRepository,
    emailService,
    socketService,
    notificationRepository,
  }) {
    this.appointmentRepository = appointmentRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.socketService = socketService;
    this.notificationRepository = notificationRepository;
  }

  async execute(request) {
    const { patientId, doctorId, appointmentDate, symptoms, type } = request;

    const startTime = new Date(appointmentDate);
    if (isNaN(startTime.getTime())) {
      throw new BusinessRuleException("Invalid date and time");
    }

    const durationMinutes = 30;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const [doctor, patient] = await Promise.all([
      this.userRepository.findById(doctorId),
      this.userRepository.findById(patientId),
    ]);

    if (!doctor || doctor.userType !== "doctor") {
      throw new BusinessRuleException("Doctor not found or invalid");
    }

    if (!patient) {
      throw new BusinessRuleException("Patient not found");
    }

    if (
      typeof doctor.isAvailableOn === "function" &&
      !doctor.isAvailableOn(startTime)
    ) {
      throw new BusinessRuleException("The doctor is not working on this day");
    }

    if (
      typeof doctor.isWorkingAt === "function" &&
      !doctor.isWorkingAt(startTime, durationMinutes)
    ) {
      throw new BusinessRuleException(
        "The doctor is off or not working during this time slot"
      );
    }

    const isOverlapping = await this.appointmentRepository.findOverlapping(
      doctorId,
      startTime,
      endTime
    );
    if (isOverlapping) {
      throw new BusinessRuleException(
        "Doctor is busy at this time (slot taken)"
      );
    }

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate: startTime,
      endTime: endTime,
      durationMinutes: durationMinutes,
      symptoms,
      type,
      status: "PENDING",
      createdAt: new Date(),
    });

    const savedAppointment = await this.appointmentRepository.save(
      newAppointment
    );

    this._handleNotifications(doctor, patient, startTime, symptoms).catch(
      (err) => console.error("Side effects error:", err)
    );

    return savedAppointment;
  }

  async _handleNotifications(doctor, patient, startTime, symptoms) {
    const doctorIdStr = (doctor.id.value || doctor.id).toString();
    const patientIdStr = (patient.id.value || patient.id).toString();

    const doctorNoti = new Notification({
      userId: doctorIdStr,
      title: "New appointment",
      message: `Patient ${patient.profile?.fullName || "Anonymous"} has just booked an appointment.`,
      type: NotificationType.BOOKING_SUCCESS,
      link: `/doctor/appointments`,
    });

    const patientNoti = new Notification({
      userId: patientIdStr,
      title: "Booking successful",
      message: `You have booked an appointment with Dr. ${doctor.profile?.fullName || doctor.username}.`,
      type: NotificationType.BOOKING_SUCCESS,
      link: `/appointments`,
    });

    await Promise.all([
      this.notificationRepository.save(doctorNoti),
      this.notificationRepository.save(patientNoti),
    ]);

    this.socketService.sendToUser(doctorIdStr, "new_notification", {
      ...doctorNoti,
      id: doctorNoti.id,
    });
    this.socketService.sendToUser(patientIdStr, "new_notification", {
      ...patientNoti,
      id: patientNoti.id,
    });

    const timeString = startTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = startTime.toLocaleDateString("en-US");

    await this.emailService.sendAppointmentConfirmation(patient.email, {
      patientName:
        patient.profile?.fullName || patient.username || "Valued customer",
      doctorName:
        doctor.profile?.fullName || doctor.username || "Doctor",
      time: timeString,
      date: dateString,
      symptoms: symptoms,
    });
  }
}

module.exports = BookAppointmentUseCase;
