class AIAnalysis {
    constructor({ suggestedSpecialty, reasoning, confidence }) {
        if (!suggestedSpecialty) throw new Error("AIAnalysis: suggestedSpecialty is required");
        this.suggestedSpecialty = suggestedSpecialty;
        this.reasoning = reasoning || "";
        this.confidence = confidence || 0;
        Object.freeze(this);
    }
}

module.exports = AIAnalysis;