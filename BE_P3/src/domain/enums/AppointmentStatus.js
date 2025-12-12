class AppointmentStatus {
  static PENDING = 'pending';
  static CONFIRMED = 'confirmed';
  static IN_PROGRESS = 'in_progress';
  static COMPLETED = 'completed';
  static CANCELLED = 'cancelled';
  static WRONG_SPECIALTY = 'wrong_specialty'
}
module.exports = AppointmentStatus;