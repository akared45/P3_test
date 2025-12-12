const { NotFoundException } = require('../../../domain/exceptions');

class GetDoctorDetailUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async execute(targetDoctorId) {
        const doctor = await this.userRepository.findById(targetDoctorId);
        if (!doctor || !doctor.isDoctor()) {
            throw new NotFoundException("Doctor not found");
        }
        return doctor;
    }
}

module.exports = GetDoctorDetailUseCase;