const NotificationType = Object.freeze({
  SYSTEM: 'system',                   
  APPOINTMENT_REMINDER: 'appointment_reminder', 
  APPOINTMENT_SUCCESS: 'appointment_success',   
  APPOINTMENT_CANCELLED: 'appointment_cancelled', 
  NEW_MESSAGE: 'new_message'         
});

module.exports = NotificationType;