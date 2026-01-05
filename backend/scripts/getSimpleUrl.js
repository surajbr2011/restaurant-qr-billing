const mongoose = require('mongoose');
const QRCode = require('../models/QRCode');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db')
    .then(async () => {
        const qr = await QRCode.findOne({ tableId: 'T-001' });

        if (!qr) {
            console.log('❌ No QR codes found. Run: node scripts/generateQRCodes.js');
            process.exit(1);
        }

        const token = qr.qrToken;
        const baseUrl = process.env.CUSTOMER_FRONTEND_URL || 'http://192.168.1.6:3001';
        const testUrl = `${baseUrl}?token=${encodeURIComponent(token)}`;

        // Output just the URL for easy copying
        console.log(testUrl);

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
