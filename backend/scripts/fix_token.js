const mongoose = require('mongoose');
const QRCode = require('../models/QRCode');
const QRCodeGenerator = require('../utils/qrCodeGenerator');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        try {
            console.log('Using Encryption Key:', process.env.ENCRYPTION_KEY);

            const tableId = 'T-001';
            const existing = await QRCode.findOne({ tableId });

            if (existing) {
                console.log(`Regenerating for ${tableId}...`);
                // Generate secure token using the current environment key
                const qrToken = QRCodeGenerator.generateToken({
                    tableId,
                    roomId: existing.metadata?.floor || 'Main Hall',
                    zone: existing.zone || 'indoor'
                });

                existing.qrToken = qrToken;
                await existing.save();
                console.log('NEW_TOKEN:', qrToken);

                // Verify immediate decryption
                const valid = QRCodeGenerator.validateToken(qrToken);
                console.log('Immediate Validation:', valid.valid ? 'SUCCESS' : 'FAILED: ' + valid.error);
            } else {
                console.log('Table T-001 not found.');
            }

        } catch (e) {
            console.error(e);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error(err));
