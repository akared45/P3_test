const Appointment = require('../../../domain/entities/Appointment');
const { BusinessRuleException } = require('../../../domain/exceptions');

class BookAppointmentUseCase {
    constructor({ appointmentRepository, userRepository }) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    async execute(request) {
        const { patientId, doctorId, appointmentDate, symptoms, type } = request;

        const startTime = new Date(appointmentDate);
        if (isNaN(startTime.getTime())) {
            throw new BusinessRuleException("Ngày giờ không hợp lệ");
        }

        const durationMinutes = 30;
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        const doctor = await this.userRepository.findById(doctorId);
        if (!doctor || doctor.userType !== 'doctor') {
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
           throw new BusinessRuleException("Doctors are off or not working during this time slot");
        }

        const isOverlapping = await this.appointmentRepository.findOverlapping(doctorId, startTime, endTime);
        if (isOverlapping) {
            throw new BusinessRuleException("Doctor is busy at this time (Slot taken)");
        }

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            appointmentDate: startTime,
            durationMinutes: durationMinutes,
            symptoms,
            type,
            status: 'PENDING',
            createdAt: new Date()
        });

        const savedAppointment = await this.appointmentRepository.save(newAppointment);
        return savedAppointment;
    }
}

module.exports = BookAppointmentUseCase;