const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    genericName: { type: String, required: true },
    drugClass: { type: String, required: true },
    unit: { type: String, default: 'Viên' },

    safety: {
        contraindications: [String],
        allergens: [String],
        isPregnancySafe: { type: Boolean, default: true }
    },

    defaultUsage: {
        timing: { type: String, enum: ['BEFORE_MEAL', 'AFTER_MEAL', 'ANYTIME'], default: 'ANYTIME' },
        instructions: String
    },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
MedicationSchema.index({ isDeleted: 1 });
module.exports = mongoose.model('Medication', MedicationSchema);