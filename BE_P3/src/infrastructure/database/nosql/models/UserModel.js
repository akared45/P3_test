const mongoose = require("mongoose");
const { UserType, Gender } = require("../../../../domain/enums");

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: Object.values(UserType)
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profile: {
        fullName: { type: String, default: "" },
        dateOfBirth: { type: Date, default: null },
        gender: {
            type: String,
            default: "Other",
            enum: Object.values(Gender)
        },
        avatarUrl: { type: String, default: null },
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
}, {    
    discriminatorKey: 'userType',
    timestamps: true,
    _id: false
});
const UserModel = mongoose.model("User", UserSchema);

const PatientSchema = new mongoose.Schema({
    contacts: [{
        type: { type: String },
        value: String,
        isPrimary: Boolean
    }],
    medicalConditions: [{
        name: String,
        diagnosedDate: Date,
        status: String,
        treatmentPlan: String,
        notes: String
    }],
    allergies: [{
        name: String,
        severity: String,
        reaction: String
    }]
});

const DoctorSchema = new mongoose.Schema({
    licenseNumber: String,
    specCode: {
        type: String,
        ref: 'Specialization'
    },
    bio: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    timeZone: { 
        type: String, 
        default: 'Asia/Ho_Chi_Minh'
    },
    unavailableDates: [Date],
    qualifications: [{
        degree: String,
        institution: String,
        year: Number
    }],
    workHistory: [{
        position: String,
        place: String,
        from: Date,
        to: Date
    }],
    schedules: [{
        day: String,
        start: String,
        end: String,
        maxPatients: Number,
        _id: false
    }],
});
const PatientModel = UserModel.discriminator(UserType.PATIENT, PatientSchema);
const DoctorModel = UserModel.discriminator(UserType.DOCTOR, DoctorSchema);
module.exports = { UserModel, PatientModel, DoctorModel };