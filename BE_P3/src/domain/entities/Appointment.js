const { AppointmentStatus, AppointmentType, PaymentStatus, PaymentMethod } = require('../enums');
const { SymptomDetail, Prescription } = require('../value_objects');
class Appointment {
  constructor({
    id,
    patientId,
    patientName,
    patientAvatar,
    doctorId,
    doctorName,
    doctorAvatar,
    type = AppointmentType.CHAT,
    appointmentDate,
    durationMinutes = 30,
    status = AppointmentStatus.PENDING,
    symptoms = '',
    doctorNotes = '',
    createdAt = new Date(),
    symptomDetails = [],
    prescriptions = [],
    amount = 0,
    paymentStatus = PaymentStatus.UNPAID,
    paymentMethod = PaymentMethod.CASH,
    transactionId = null,
    paymentUrl = null,
    startTime,
    endTime
  }) {
    if (!patientId) throw new Error("Appointment must have a patient");
    if (!doctorId) throw new Error("Appointment must have a doctor");
    if (!appointmentDate) throw new Error("Appointment date is required");
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.type = type;
    this.appointmentDate = new Date(appointmentDate);
    this.durationMinutes = Number(durationMinutes);
    this.patientName = patientName;
    this.patientAvatar = patientAvatar;
    this.doctorName = doctorName;
    this.doctorAvatar = doctorAvatar;
    this.status = status;
    this.symptoms = symptoms?.trim() || '';
    this.doctorNotes = doctorNotes?.trim() || '';
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.symptomDetails = (symptomDetails || []).map(s => new SymptomDetail(s));
    this.prescriptions = (prescriptions || []).map(p => new Prescription(p));
    this.amount = Number(amount) || 0;
    this.paymentStatus = paymentStatus;
    this.paymentMethod = paymentMethod;
    this.transactionId = transactionId;
    this.paymentUrl = paymentUrl;
    this.startTime = startTime; 
    this.endTime = endTime;
    Object.freeze(this);
  }
  updatePaymentUrl(url) {
    return new Appointment({
      ...this,
      paymentUrl: url
    });
  }
  isConfirmed() {
    return this.status === AppointmentStatus.CONFIRMED;
  }

  canBeCancelled() {
    return this.status === AppointmentStatus.PENDING || this.status === AppointmentStatus.CONFIRMED;
  }

  confirm() {
    if (this.status !== AppointmentStatus.PENDING) {
      throw new Error("Only pending appointments can be confirmed");
    }
    return new Appointment({ ...this, status: AppointmentStatus.CONFIRMED });
  }

  cancel(reason) {
    if (!this.canBeCancelled()) {
      throw new Error("Cannot cancel this appointment");
    }
    return new Appointment({
      ...this,
      status: AppointmentStatus.CANCELLED,
      doctorNotes: reason ? `Cancelled: ${reason}` : this.doctorNotes
    });
  }

  complete(doctorNotes, prescriptions, updatedSymptoms = null) {
    if (this.status !== 'confirmed' && this.status !== 'in_progress') {
      throw new Error("Appointment must be confirmed or in-progress to complete.");
    }

    return new Appointment({
      ...this,
      status: 'completed',
      doctorNotes: doctorNotes,
      prescriptions: prescriptions,
      symptoms: updatedSymptoms || this.symptoms
    });
  }

  hasParticipant(userId) {
    return String(this.patientId) === String(userId) ||
      String(this.doctorId) === String(userId);
  }

  markAsPaid(method, transactionId) {
    let newStatus = this.status;

    if (this.status === AppointmentStatus.PENDING) {
      newStatus = AppointmentStatus.CONFIRMED;
    }

    return new Appointment({
      ...this,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: method,
      transactionId: transactionId,
      status: newStatus,
      updatedAt: new Date()
    });
  }

  isSessionActive() {
        const now = new Date().getTime();
        const start = this.startTime.getTime();
        const end = this.endTime.getTime();
        
        // Cho phép vào sớm 15 phút
        const BUFFER_MS = 15 * 60 * 1000; 
        const allowedStart = start - BUFFER_MS;
        
        // Cho phép xem lại 30 phút sau khi kết thúc
        const GRACE_MS = 30 * 60 * 1000;
        const allowedEnd = end + GRACE_MS;

        // --- [DEBUG LOG: XEM SERVER TÍNH TOÁN GÌ] ---
        console.log("=== CHECK TIME DEBUG ===");
        console.log(`🕒 Hiện tại (Now)     : ${new Date(now).toLocaleString("vi-VN")}`);
        console.log(`🏁 Giờ Hẹn (Start)    : ${new Date(start).toLocaleString("vi-VN")}`);
        console.log(`✅ Được vào từ        : ${new Date(allowedStart).toLocaleString("vi-VN")} (Đã trừ 15p)`);
        console.log(`❌ Kết quả so sánh    : ${now} >= ${allowedStart} ? -> ${now >= allowedStart}`);
        console.log("========================");

        if (now < allowedStart) {
            // Tính xem còn bao nhiêu phút
            const diffMinutes = Math.ceil((allowedStart - now) / 60000);
            return { 
                active: false, 
                reason: 'too_early', 
                message: `Chưa đến giờ hẹn. Vui lòng quay lại sau ${diffMinutes} phút nữa.` 
            };
        }

        if (now > allowedEnd) {
            return { active: false, reason: 'ended', message: "Phiên tư vấn đã kết thúc." };
        }

        return { active: true };
    }
}

module.exports = Appointment;