const { NotImplementedException } = require('../exceptions');

class IAIService {
    async analyzeSymptoms(symptoms, availableSpecializations) {
        throw new NotImplementedException('IAIService.analyzeSymptoms');
    }
}

module.exports = IAIService;