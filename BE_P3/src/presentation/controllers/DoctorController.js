const DoctorProfileResponse = require('../../application/dtos/doctor/DoctorProfileResponse');

class DoctorController {
    constructor({ getDoctorListUseCase, getDoctorDetailUseCase, getAvailableSlotsUseCase }) {
        this.getDoctorListUseCase = getDoctorListUseCase;
        this.getDoctorDetailUseCase = getDoctorDetailUseCase;
        this.getAvailableSlotsUseCase = getAvailableSlotsUseCase;
    }

    getList = async (req, res, next) => {
        try {
            const doctors = await this.getDoctorListUseCase.execute();
            const response = doctors.map(doc => new DoctorProfileResponse(doc));
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req, res, next) => {
        try {
            const { id } = req.params;
            const doctorEntity = await this.getDoctorDetailUseCase.execute(id);

            if (!doctorEntity) {
                return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
            }

            const response = new DoctorProfileResponse(doctorEntity);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    getSlots = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { date } = req.query;

            if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({ message: "Vui lòng cung cấp ngày đúng định dạng YYYY-MM-DD" });
            }

            const availableSlots = await this.getAvailableSlotsUseCase.execute({
                doctorId: id,
                dateString: date
            });

            res.status(200).json({
                doctorId: id,
                date: date,
                availableSlots: availableSlots
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = DoctorController;