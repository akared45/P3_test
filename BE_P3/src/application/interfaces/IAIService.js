const { NotImplementedException } = require('../../domain/exceptions');

class IAIService {
    async suggestSpecialty(symptoms, availableSpecialties) {
        throw new NotImplementedException('IAIService.suggestSpecialty');
    }
}

module.exports = IAIService;