const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// In a real application, you would store users in a database
// This is just for demonstration purposes
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  name: 'Administrator'
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check credentials
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Create JWT token
    const token = jwt.sign(
      { 
        id: '1', 
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: '1',
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route example
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    name: req.user.name
  });
});

module.exports = router;