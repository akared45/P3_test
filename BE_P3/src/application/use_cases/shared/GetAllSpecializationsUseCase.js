class GetAllSpecializationsUseCase {
  constructor({ specializationRepository }) {
    this.specializationRepository = specializationRepository;
  }

  async execute() {
    return await this.specializationRepository.findAll();
  }
}

module.exports = GetAllSpecializationsUseCase;