const SpecializationModel = require('../../../infrastructure/database/nosql/models/SpecializationModel');

class SuggestSpecialtyUseCase {
    constructor({ aiService }) {
        this.aiService = aiService;
    }

    async execute(symptoms) {
        const specialties = await SpecializationModel.find({}, '_id name');
        const suggestion = await this.aiService.suggestSpecialty(symptoms, specialties);
        return suggestion;
    }
}

module.exports = SuggestSpecialtyUseCase;