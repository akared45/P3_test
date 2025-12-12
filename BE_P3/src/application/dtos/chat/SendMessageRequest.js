class SendMessageRequest {
  constructor({ senderId, appointmentId, content, type = 'text', fileUrl = null }) {
    this.senderId = senderId;
    this.appointmentId = appointmentId;
    this.content = content;
    this.type = type;
    this.fileUrl = fileUrl;
  }
}
module.exports = SendMessageRequest;