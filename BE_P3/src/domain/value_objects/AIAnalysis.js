class AIAnalysis {
    constructor({ sentiment, intent, keyPhrases, riskLevel }) {
        this.sentiment = sentiment || 'neutral';
        this.intent = intent || 'unknown';
        this.keyPhrases = Array.isArray(keyPhrases) ? keyPhrases : [];
        this.riskLevel = riskLevel || 'low';
        Object.freeze(this);
    }
}
module.exports = AIAnalysis;