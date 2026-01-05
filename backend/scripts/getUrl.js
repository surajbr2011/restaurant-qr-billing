const mongoose = require('mongoose');
const QRCode = require('../models/QRCode');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db')
    .then(async () => {
        const qr = await QRCode.findOne({ tableId: 'T-001' });

        if (!qr) {
            console.log('No QR codes found');
            process.exit(1);
        }

        const testUrl = `http://localhost:3001?token=${encodeURIComponent(qr.qrToken)}`;
        console.log(testUrl);

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
