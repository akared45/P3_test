const { AuthorizationException, NotFoundException } = require('../../../domain/exceptions');
const AIAnalysis = require('../../../domain/value_objects/AIAnalysis');

class GetAISuggestionUseCase {
    constructor({ appointmentRepository, userRepository, aiService }) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
    }

    async execute({ appointmentId, requesterId }) {
        const appointment = await this.appointmentRepository.findById(appointmentId);
        if (!appointment) throw new NotFoundException("Appointment");
        if (appointment.doctorId !== requesterId) {

        }
        const patient = await this.userRepository.findById(appointment.patientId);
        const recentMessages = appointment.messages.slice(-10);
        const aiResult = await this.aiService.analyzeSymptoms(
            recentMessages,
            patient ? patient.medicalConditions : []
        );
        return new AIAnalysis(aiResult);
    }
}

module.exports = GetAISuggestionUseCase;