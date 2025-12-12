class GetMyAppointmentsUseCase {
  constructor({ appointmentRepository }) {
    this.appointmentRepository = appointmentRepository;
  }

  async execute(userId) {
    if (!userId) throw new Error("User ID is required");
    return await this.appointmentRepository.findByUserId(userId);
  }
}

module.exports = GetMyAppointmentsUseCase;