const PatientProfileResponse = require('../../application/dtos/patient/PatientProfileResponse');
const DoctorProfileResponse = require('../../application/dtos/doctor/DoctorProfileResponse');

class UserController {
    constructor({ getUserProfileUseCase }) {
        this.getUserProfileUseCase = getUserProfileUseCase;
    }

    getProfile = async (req, res, next) => {
        try {
            const targetId = req.params.id === 'me' ? req.user.id : req.params.id;

            const entity = await this.getUserProfileUseCase.execute({
                currentUserId: req.user.id,
                targetUserId: targetId
            });

            let response;
            if (entity.isDoctor()) response = new DoctorProfileResponse(entity);
            else response = new PatientProfileResponse(entity);

            res.status(200).json(response);
        } catch (error) { next(error); }
    };
}

module.exports = UserController;