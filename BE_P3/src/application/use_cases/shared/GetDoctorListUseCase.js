const { UserType } = require('../../../domain/enums');

class GetDoctorListUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async execute(request = {}) {
        const { options = {} } = request;
        const doctors = await this.userRepository.findAllByUserType(UserType.DOCTOR, options);
        return doctors.filter(doc => doc.isActive);
    }

}

module.exports = GetDoctorListUseCase;