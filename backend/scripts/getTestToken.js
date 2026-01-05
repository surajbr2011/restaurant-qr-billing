const mongoose = require('mongoose');
const QRCode = require('../models/QRCode');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db')
    .then(async () => {
        console.log('✅ Connected to MongoDB\n');

        // Get first QR code
        const qr = await QRCode.findOne({ tableId: 'T-001' });

        if (!qr) {
            console.log('❌ No QR codes found. Run: node scripts/generateQRCodes.js');
            process.exit(1);
        }

        console.log('🎫 QR Code for Testing');
        console.log('═'.repeat(60));
        console.log(`Table ID: ${qr.tableId}`);
        console.log(`Table Name: ${qr.metadata.tableName}`);
        console.log(`Zone: ${qr.zone}`);
        console.log(`Capacity: ${qr.metadata.capacity} guests`);
        console.log('═'.repeat(60));

        console.log('\n🔑 QR Token:');
        console.log(qr.qrToken);

        console.log('\n📱 Test URL (Customer Frontend):');
        const testUrl = `http://localhost:3001?token=${encodeURIComponent(qr.qrToken)}`;
        console.log(testUrl);

        console.log('\n📋 Copy this URL and open in your browser to test!');
        console.log('\nOr test validation:');
        console.log(`curl -X POST http://localhost:5001/api/qrcode/validate -H "Content-Type: application/json" -d "{\\"token\\":\\"${qr.qrToken}\\"}"`);

        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
