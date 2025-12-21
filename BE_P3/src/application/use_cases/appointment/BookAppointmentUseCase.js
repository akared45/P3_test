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
      throw new BusinessRuleException("Ngày giờ không hợp lệ");
    }
    console.log("1. Raw Data từ FE:", appointmentDate);
    const durationMinutes = 30;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
    console.log("2. Start Time (Local):", startTime.toLocaleString("vi-VN"));
    console.log("3. Start Time (ISO/UTC):", startTime.toISOString());
    console.log("4. End Time (ISO/UTC):", endTime.toISOString());
    const doctor = await this.userRepository.findById(doctorId);
    if (!doctor || doctor.userType !== "doctor") {
      throw new BusinessRuleException("Doctor not found");
    }

    const patient = await this.userRepository.findById(patientId);
    if (!patient) {
      throw new BusinessRuleException("Patient not found");
    }

    if (!doctor.isAvailableOn(startTime)) {
      throw new BusinessRuleException("The doctor is not working on this day");
    }

    if (!doctor.isWorkingAt(startTime, durationMinutes)) {
      throw new BusinessRuleException(
        "Doctors are off or not working during this time slot"
      );
    }

    const isOverlapping = await this.appointmentRepository.findOverlapping(
      doctorId,
      startTime,
      endTime
    );
    if (isOverlapping) {
      throw new BusinessRuleException(
        "Doctor is busy at this time (Slot taken)"
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
    const doctorIdStr = doctor.id.value || doctor.id;
    const patientIdStr = patient.id.value || patient.id;
    try {
      const doctorNoti = new Notification({
        userId: doctorIdStr.toString(),
        title: "Lịch hẹn mới",
        message: `Bệnh nhân ${patient.profile.fullName} vừa đặt lịch.`,
        type: NotificationType.BOOKING_SUCCESS,
        link: `/doctor/appointments`,
      });
      await this.notificationRepository.save(doctorNoti);

      this.socketService.sendToUser(
        doctorIdStr.toString(),
        "new_notification",
        {
          ...doctorNoti,
          id: doctorNoti.id,
        }
      );

      const patientNoti = new Notification({
        userId: patientIdStr.toString(),
        title: "Đặt lịch thành công",
        message: `Bạn đã đặt lịch khám với BS ${doctor.profile.fullName}.`,
        type: NotificationType.BOOKING_SUCCESS,
        link: `/appointments`,
      });
      await this.notificationRepository.save(patientNoti);

      this.socketService.sendToUser(
        patientIdStr.toString(),
        "new_notification",
        {
          ...patientNoti,
          id: patientNoti.id,
        }
      );

      const timeString = startTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateString = startTime.toLocaleDateString("vi-VN");

      this.emailService
        .sendAppointmentConfirmation(patient.email, {
          patientName:
            patient.profile?.fullName || patient.username || "Quý khách",
          doctorName: doctor.profile?.fullName || doctor.username || "Bác sĩ",
          time: timeString,
          date: dateString,
          symptoms: symptoms,
        })
        .catch((err) => console.error("Lỗi gửi email xác nhận:", err));
    } catch (error) {
      console.error("Lỗi trong quá trình gửi thông báo/email:", error);
    }

    return savedAppointment;
  }
}

module.exports = BookAppointmentUseCase;
