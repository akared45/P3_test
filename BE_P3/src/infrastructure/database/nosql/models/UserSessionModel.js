const mongoose = require("mongoose");

const UserSessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
        ref: 'User'
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("UserSession", UserSessionSchema);