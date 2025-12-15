const BookAppointmentRequest = require('../../application/dtos/appointment/BookAppointmentRequest');
const AppointmentResponse = require('../../application/dtos/appointment/AppointmentResponse');
const CompleteAppointmentRequest = require('../../application/dtos/appointment/CompleteAppointmentRequest');
class AppointmentController {
    constructor({ bookAppointmentUseCase, getMyAppointmentsUseCase, getBusySlotsUseCase, completeAppointmentUseCase }) {
        this.bookAppointmentUseCase = bookAppointmentUseCase;
        this.getMyAppointmentsUseCase = getMyAppointmentsUseCase;
        this.getBusySlotsUseCase = getBusySlotsUseCase;
        this.completeAppointmentUseCase = completeAppointmentUseCase;
    }

    bookAppointment = async (req, res, next) => {
        try {
            const requestDto = new BookAppointmentRequest({
                patientId: req.user.id,
                ...req.body
            });
            const result = await this.bookAppointmentUseCase.execute(requestDto);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    getMyAppointments = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userType = req.user.role;
            const appointmentEntities = await this.getMyAppointmentsUseCase.execute(userId, userType);
            const response = appointmentEntities.map(entity => new AppointmentResponse(entity));
            return res.status(200).json({
                success: true,
                data: response
            });

        } catch (error) {
            next(error);
        }
    };

    getBusySlots = async (req, res, next) => {
        try {
            const { doctorId } = req.params;
            const { date } = req.query;

            if (!date) return res.status(400).json({ message: "Thiếu tham số date" });

            const result = await this.getBusySlotsUseCase.execute({ doctorId, date });
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    async complete(req, res, next) {
        try {
            const request = new CompleteAppointmentRequest({
                userId: req.user.id,
                appointmentId: req.params.id,
                ...req.body
            });

            const result = await this.completeAppointmentUseCase.execute(request);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AppointmentController;