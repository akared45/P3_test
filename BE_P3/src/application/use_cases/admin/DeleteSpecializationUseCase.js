const { NotFoundException } = require('../../../domain/exceptions');

class DeleteSpecializationUseCase {
    constructor({ specializationRepository }) {
        this.specializationRepository = specializationRepository;
    }

    async execute(code) {
        const existingSpec = await this.specializationRepository.findById(code);
        if (!existingSpec) {
            throw new NotFoundException(`Specialization '${code}'`);
        }

        await this.specializationRepository.delete(code);

        return { message: "Specialization deleted successfully" };
    }
}

module.exports = DeleteSpecializationUseCase;