class MessageResponse {
  constructor(messageEntity) {
    this.id = messageEntity.id;
    this.senderId = messageEntity.senderId;
    this.appointmentId = messageEntity.appointmentId;
    this.content = messageEntity.content;
    this.type = messageEntity.type;
    this.fileUrl = messageEntity.fileUrl || null;
    this.isRead = messageEntity.isRead;
    this.createdAt = messageEntity.createdAt;
    this.aiAnalysis = messageEntity.aiAnalysis ? {
      sentiment: messageEntity.aiAnalysis.sentiment,
      riskLevel: messageEntity.aiAnalysis.riskLevel,
      intent: messageEntity.aiAnalysis.intent
    } : null;
  }
}

module.exports = MessageResponse;