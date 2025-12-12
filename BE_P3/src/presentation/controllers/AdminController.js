const CreateDoctorRequest = require('../../application/dtos/doctor/CreateDoctorRequest');
const UpdateDoctorRequest = require('../../application/dtos/doctor/UpdateDoctorRequest');
const DeleteUserRequest = require('../../application/dtos/admin/DeleteUserRequest');

class AdminController {
    constructor({ createDoctorUseCase, updateDoctorUseCase, deleteUserUseCase }) {
        this.createDoctorUseCase = createDoctorUseCase;
        this.updateDoctorUseCase = updateDoctorUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }
    
    createDoctor = async (req, res, next) => {
        try {
            const requestDto = new CreateDoctorRequest({
                currentUserId: req.user.id,
                ...req.body
            });
            const result = await this.createDoctorUseCase.execute(requestDto);
            res.status(201).json(result);
        } catch (error) { next(error); }
    };

    updateDoctor = async (req, res, next) => {
        try {
            const requestDto = new UpdateDoctorRequest({
                currentUserId: req.user.id,
                targetDoctorId: req.params.id,
                ...req.body
            });
            const result = await this.updateDoctorUseCase.execute(requestDto);
            res.status(200).json(result);
        } catch (error) { next(error); }
    };

    deleteUser = async (req, res, next) => {
        try {
            const requestDto = new DeleteUserRequest({
                currentUserId: req.user.id,
                targetUserId: req.params.id
            });

            const result = await this.deleteUserUseCase.execute(requestDto);
            res.status(200).json(result);
        } catch (error) { next(error); }
    };
}

module.exports = AdminController;