const mongoose = require('mongoose');

const { 
    AppointmentStatus, 
    AppointmentType, 
    PaymentStatus, 
    PaymentMethod 
} = require('../../../../domain/enums');

const PrescriptionSubSchema = new mongoose.Schema({
    drugName: { type: String, required: true },
    quantity: { type: String, required: true }, 
    usage: { type: String, required: true },  
    medicationCode: { type: String, default: null }, 
    instructions: { type: String, default: '' }     
}, { _id: false });

const SymptomDetailSubSchema = new mongoose.Schema({
    name: String,
    severity: String
}, { _id: false });

const AppointmentSchema = new mongoose.Schema({
    _id: { type: String, required: true },

    patientId: { type: String, ref: 'User', required: true },
    doctorId: { type: String, ref: 'User', required: true },

    appointmentDate: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    type: {
        type: String,
        enum: Object.values(AppointmentType),
        default: 'chat'
    },

    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        default: 'pending'
    },

    symptoms: { type: String, default: '' },
    doctorNotes: { type: String, default: '' },
    symptomDetails: [SymptomDetailSubSchema],
    prescriptions: [PrescriptionSubSchema], 
    amount: { type: Number, default: 0 },
    
    paymentStatus: { 
        type: String, 
        enum: Object.values(PaymentStatus || {}), 
        default: 'UNPAID' 
    },
    
    paymentMethod: { 
        type: String, 
        enum: Object.values(PaymentMethod || {}), 
        default: 'CASH' 
    },
    
    transactionId: { type: String, default: null }, 
    paymentUrl: { type: String, default: null }  

}, { 
    timestamps: true, 
    _id: false
});

AppointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
AppointmentSchema.index({ patientId: 1, startTime: -1 });
AppointmentSchema.index({ paymentStatus: 1 }); 

module.exports = mongoose.model('Appointment', AppointmentSchema);