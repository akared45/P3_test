const { NotFoundException } = require('../../../domain/exceptions');

class UpdateSpecializationUseCase {
    constructor({ specializationRepository }) {
        this.specializationRepository = specializationRepository;
    }

    async execute(request) {
        const { code, name, category } = request;
        const existingSpec = await this.specializationRepository.findById(code);
        if (!existingSpec) {
            throw new NotFoundException(`Specialization '${code}'`);
        }

        const updatedSpec = existingSpec.update({
            name: name,
            category: category
        });

        await this.specializationRepository.update(updatedSpec);

        return { message: "Specialization updated successfully" };
    }
}

module.exports = UpdateSpecializationUseCase;