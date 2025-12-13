const mongoose = require("mongoose");
const TokenType = require("../../../../domain/enums/TokenType")
const VerificationTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: Object.values(TokenType),
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: false, 
    collection: 'verificationtokens'
});

VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("VerificationToken", VerificationTokenSchema);