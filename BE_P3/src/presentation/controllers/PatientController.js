const UpdatePatientRequest = require('../../application/dtos/patient/UpdatePatientRequest');
const PatientProfileResponse = require('../../application/dtos/patient/PatientProfileResponse');

class PatientController {
    constructor({ getPatientListUseCase, updatePatientProfileUseCase }) {
        this.getPatientListUseCase = getPatientListUseCase;
        this.updatePatientProfileUseCase = updatePatientProfileUseCase;
    }

    getList = async (req, res, next) => {
        try {
            const { limit, skip } = req.query;

            const patients = await this.getPatientListUseCase.execute({
                currentUserId: req.user.id,
                options: { limit: Number(limit) || 10, skip: Number(skip) || 0 }
            });

            const response = patients.map(p => new PatientProfileResponse(p));
            res.status(200).json(response);
        } catch (error) { next(error); }
    };

    updateMe = async (req, res, next) => {
        try {
            const requestDto = new UpdatePatientRequest({
                currentUserId: req.user.id,
                targetPatientId: req.user.id,
                ...req.body
            });
            const updatedEntity = await this.updatePatientProfileUseCase.execute(requestDto);
            const responseDto = new PatientProfileResponse(updatedEntity);
            res.status(200).json({
                success: true,
                message: "Hồ sơ cập nhật thành công.",
                data: responseDto
            });
        } catch (error) { next(error); }
    }
}

module.exports = PatientController;