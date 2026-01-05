const mongoose = require('mongoose');
const QRCode = require('../models/QRCode');
require('dotenv').config();

async function resetQRCodes() {
    try {
        console.log('🔄 Resetting QR Codes...\n');

        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db');
        console.log('✅ Connected to MongoDB\n');

        // Delete all existing QR codes
        const deleteResult = await QRCode.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} old QR codes\n`);

        console.log('✅ Database cleared!');
        console.log('\nNow run: node scripts/generateQRCodes.js');
        console.log('This will create fresh QR codes with the correct encryption key.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetQRCodes();
