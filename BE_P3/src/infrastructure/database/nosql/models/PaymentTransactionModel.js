const mongoose = require('mongoose');

const PaymentTransactionSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        required: true,
        index: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    rawResponse: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'payment_transactions',
    versionKey: false
});

module.exports = mongoose.model('PaymentTransaction', PaymentTransactionSchema);