const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io for Real-time Seat Availability
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Attach io to app context for controllers
app.set('io', io);

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'IMovies Cinema Booking API is active and running',
    timestamp: new Date().toISOString(),
  });
});

// Real-Time Socket Connection
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  socket.on('join-show', (showId) => {
    socket.join(showId);
    console.log(`[Socket] Client ${socket.id} joined show room: ${showId}`);
  });

  socket.on('seat-select', ({ showId, seatNumber, userId }) => {
    socket.to(showId).emit('seat-selected-live', { seatNumber, userId });
  });

  socket.on('seat-deselect', ({ showId, seatNumber, userId }) => {
    socket.to(showId).emit('seat-deselected-live', { seatNumber, userId });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

// Serve Frontend Static Build if present
const frontendBuild = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// Centralized Error Handler (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` 🎬 IMovies Server running on port ${PORT}`);
  console.log(` 🚀 Web App URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
