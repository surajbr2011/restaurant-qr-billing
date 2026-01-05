const mongoose = require('mongoose');

const tableSessionSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: true
    },
    roomId: String,
    zone: String,
    sessionToken: {
        type: String,
        required: true,
        unique: true
    },
    customerName: String,
    customerPhone: String,
    guestCount: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    qrCodeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QRCode'
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    totalAmount: {
        type: Number,
        default: 0
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Auto-expire sessions after 3 hours of inactivity
tableSessionSchema.index({ lastActivity: 1 }, {
    expireAfterSeconds: 10800 // 3 hours
});

module.exports = mongoose.model('TableSession', tableSessionSchema);
