const mongoose = require('mongoose');
const { AppointmentStatus, AppointmentType } = require('../../../../domain/enums');
const AppointmentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    patientId: {
        type: String,
        ref: 'User',
        required: true
    },

    doctorId: {
        type: String,
        ref: 'User',
        required: true
    },

    appointmentDate: {
        type: Date,
        required: true
    },

    durationMinutes: {
        type: Number,
        default: 30
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    type: {
        type: String,
        enum: Object.values(AppointmentType),
        lowercase: true,
        default: 'chat'
    },

    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        lowercase: true,
        default: 'pending'
    },

    symptoms: String,
    doctorNotes: String,

    symptomDetails: [{ type: mongoose.Schema.Types.Mixed }],
    prescriptions: [{ type: mongoose.Schema.Types.Mixed }]

}, { timestamps: true, _id: false });

AppointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
AppointmentSchema.index({ patientId: 1, startTime: -1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);