const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: true,
        unique: true
    },
    roomId: {
        type: String,
        default: null
    },
    zone: {
        type: String,
        enum: ['indoor', 'outdoor', 'vip', 'bar', 'lounge', 'Main Hall', 'terrace', 'garden'],
        default: 'indoor'
    },
    qrToken: {
        type: String,
        required: true,
        unique: true
    },
    qrCodeUrl: {
        type: String // Base64 or file path
    },
    isActive: {
        type: Boolean,
        default: true
    },
    generatedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: null // null means never expires
    },
    usageCount: {
        type: Number,
        default: 0
    },
    lastScannedAt: {
        type: Date
    },
    metadata: {
        tableName: String,
        capacity: Number,
        floor: String
    }
}, {
    timestamps: true
});

// Index for faster lookups
qrCodeSchema.index({ qrToken: 1 });
qrCodeSchema.index({ tableId: 1 });

module.exports = mongoose.model('QRCode', qrCodeSchema);
