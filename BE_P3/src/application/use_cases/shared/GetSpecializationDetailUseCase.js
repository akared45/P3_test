const { NotFoundException } = require('../../../domain/exceptions');
const SpecializationResponse = require('../../dtos/specialization/SpecializationResponse');

class GetSpecializationDetailUseCase {
  constructor({ specializationRepository }) {
    this.specializationRepository = specializationRepository;
  }

  async execute(code) {
    const spec = await this.specializationRepository.findById(code);
    if (!spec) throw new NotFoundException("Specialization");
    
    return new SpecializationResponse(spec);
  }
}

module.exports = GetSpecializationDetailUseCase;