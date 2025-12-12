const Specialization = require('../../../domain/entities/Specialization');
const { BusinessRuleException } = require('../../../domain/exceptions');
const SpecializationResponse = require('../../dtos/specialization/SpecializationResponse');

class CreateSpecializationUseCase {
    constructor({ specializationRepository }) {
        this.specializationRepository = specializationRepository;
    }

    async execute(request) {
        const { code, name, category } = request;

        const existing = await this.specializationRepository.findById(code);
        if (existing) {
            throw new BusinessRuleException(`Specialization code '${code}' already exists`);
        }

        const newSpec = new Specialization({ code, name, category });

        await this.specializationRepository.create(newSpec);

        return new SpecializationResponse(newSpec);
    }
}

module.exports = CreateSpecializationUseCase;