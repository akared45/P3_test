const { NotFoundException } = require('../../../domain/exceptions');

class UpdateAppointmentStatusUseCase {
    constructor({ appointmentRepository }) {
        this.appointmentRepository = appointmentRepository;
    }

    async execute({ appointmentId, action, userId, note, prescriptions }) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) {
            throw new NotFoundException("Appointment not found");
        }
        if (!appointment.hasParticipant(userId)) {
            throw new Error("Unauthorized to update this appointment");
        }

        let updatedAppointment;
        switch (action) {
            case 'CONFIRM':
                updatedAppointment = appointment.confirm();
                break;
            case 'CANCEL':
                updatedAppointment = appointment.cancel(note);
                break;
            case 'COMPLETE':
                updatedAppointment = appointment.complete(note, prescriptions);
                break;
            default:
                throw new Error("Invalid action");
        }
        await this.appointmentRepository.update(updatedAppointment);
        return updatedAppointment;
    }
}

module.exports = UpdateAppointmentStatusUseCase;