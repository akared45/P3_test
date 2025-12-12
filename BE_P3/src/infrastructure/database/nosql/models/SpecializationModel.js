const mongoose = require('mongoose');

const SpecializationSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        default: 'OTHER'
    },

    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    
    deletedAt: { 
        type: Date, 
        default: null 
    }
}, {
    _id: false,
    timestamps: true
});

module.exports = mongoose.model('Specialization', SpecializationSchema);