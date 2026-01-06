const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Parse CORS origins from environment variable
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ["http://localhost:3000", "http://localhost:3001"];

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: '*', // Allow ALL origins (Wildcard)
  credentials: false // Must be false when using wildcard
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join admin room for order updates
  socket.on('join_admin_room', () => {
    socket.join('admin_room');
    console.log('Admin joined admin room');
  });

  // Join specific table room for bill updates
  socket.on('join_table_room', (tableId) => {
    socket.join(`table_${tableId}`);
    console.log(`Client joined table room: table_${tableId}`);
  });

  // Handle bill request from customer
  socket.on('request_bill', (tableId) => {
    console.log(`Table ${tableId} requested bill`);
    io.to('admin_room').emit('bill_requested', { tableId, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/qrcode', require('./routes/qrcode'));
app.use('/api/customer', require('./routes/customer').router);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});