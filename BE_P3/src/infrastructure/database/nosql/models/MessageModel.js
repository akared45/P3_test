const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  appointmentId: { type: String, ref: 'Appointment', required: true }, 
  
  senderId: { type: String, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  fileUrl: { type: String },
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true,

});

module.exports = mongoose.model('Message', MessageSchema);