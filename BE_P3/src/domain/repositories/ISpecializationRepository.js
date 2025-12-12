const { NotImplementedException } = require('../exceptions');

class ISpecializationRepository {
  async findAll() {
    throw new NotImplementedException('ISpecializationRepository.findAll');
  }

  async findById(code) {
    throw new NotImplementedException('ISpecializationRepository.findById');
  }

  async create(specialization) {
    throw new NotImplementedException('ISpecializationRepository.create');
  }

  async update(specialization) {
    throw new NotImplementedException('ISpecializationRepository.update');
  }

  async delete(code) {
    throw new NotImplementedException('ISpecializationRepository.delete');
  }
}

module.exports = ISpecializationRepository;