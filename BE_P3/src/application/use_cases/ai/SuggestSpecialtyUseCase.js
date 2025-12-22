class SuggestSpecialtyUseCase {
    constructor({ aiService, specializationRepository }) {
        this.aiService = aiService;
        this.specializationRepository = specializationRepository;
    }

    async execute(request) {
        const { symptoms } = request;
        if (!symptoms) throw new Error("Please enter the symptoms");

        const allSpecs = await this.specializationRepository.findAll();
        const specNames = allSpecs.map(s => s.name);
        const analysis = await this.aiService.analyzeSymptoms(symptoms, specNames);

        const matchedSpec = allSpecs.find(s =>
            s.name.toLowerCase() === analysis.suggestedSpecialty.toLowerCase()
        );

        return {
            symptoms,
            suggestion: {
                specialtyName: analysis.suggestedSpecialty,
                reasoning: analysis.reasoning,
                confidence: analysis.confidence,
                specializationId: matchedSpec ? matchedSpec.id : null,
                specializationImage: matchedSpec ? matchedSpec.image : null
            }
        };
    }
}

module.exports = SuggestSpecialtyUseCase;