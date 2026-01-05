const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const TableSession = require('../models/TableSession');
const QRCode = require('../models/QRCode');
const QRCodeGenerator = require('../utils/qrCodeGenerator');

// Create customer session (login)
router.post('/login', async (req, res) => {
    try {
        const {
            qrToken,
            customerName,
            customerPhone,
            guestCount
        } = req.body;

        // Validate QR token
        const validation = QRCodeGenerator.validateToken(qrToken);

        if (!validation.valid) {
            return res.status(400).json({ message: 'Invalid QR code' });
        }

        // Get QR code from database
        const qrCode = await QRCode.findOne({ qrToken });

        if (!qrCode || !qrCode.isActive) {
            return res.status(404).json({ message: 'QR code not found or inactive' });
        }

        // Check for existing active session
        const existingSession = await TableSession.findOne({
            tableId: qrCode.tableId,
            status: 'active'
        });

        if (existingSession) {
            // End previous session
            existingSession.status = 'abandoned';
            existingSession.endTime = new Date();
            await existingSession.save();
        }

        // Create new session
        const session = new TableSession({
            tableId: qrCode.tableId,
            roomId: qrCode.roomId,
            zone: qrCode.zone,
            sessionToken: crypto.randomBytes(32).toString('hex'),
            customerName,
            customerPhone,
            guestCount: guestCount || 1,
            qrCodeId: qrCode._id
        });

        await session.save();

        // Generate JWT token
        const jwtToken = QRCodeGenerator.generateSessionToken(session);

        res.json({
            message: 'Session created successfully',
            sessionToken: jwtToken,
            session: {
                id: session._id,
                tableId: session.tableId,
                roomId: session.roomId,
                zone: session.zone,
                guestCount: session.guestCount
            }
        });

    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: 'Failed to create session' });
    }
});

// Middleware to verify session token
const verifySession = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = QRCodeGenerator.verifySessionToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const session = await TableSession.findById(decoded.sessionId);

        if (!session || session.status !== 'active') {
            return res.status(401).json({ message: 'Session expired or invalid' });
        }

        // Update last activity
        session.lastActivity = new Date();
        await session.save();

        req.session = session;
        req.sessionData = decoded;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

// Get current session
router.get('/session', verifySession, async (req, res) => {
    res.json({
        session: req.session
    });
});

// Logout (end session)
router.post('/logout', verifySession, async (req, res) => {
    try {
        req.session.status = 'completed';
        req.session.endTime = new Date();
        await req.session.save();

        res.json({ message: 'Session ended successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to end session' });
    }
});

// Get active sessions (admin)
router.get('/sessions/active', async (req, res) => {
    try {
        const sessions = await TableSession.find({ status: 'active' })
            .populate('qrCodeId')
            .populate('orders')
            .sort({ startTime: -1 });

        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sessions' });
    }
});

module.exports = { router, verifySession };
