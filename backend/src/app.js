const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const safeRouteRoutes = require('./routes/safeRoute.routes');
const fcmRoutes = require('./routes/fcm.routes'); // Import FCM route
const liveLocationRoutes = require('./routes/liveLocation.routes'); // Import live location route

dotenv.config(); // Load environment variables

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes setup
app.use('/auth', authRoutes);
app.use('/safe-route', safeRouteRoutes);
app.use('/send-notification', fcmRoutes); // Use FCM route
app.use('/live-location', liveLocationRoutes); // Use live location routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
