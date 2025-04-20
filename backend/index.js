// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // We'll use this soon
const authRoutes = require('./routes/auth'); // Import the auth routes

const app = express();
const port = process.env.PORT || 5000; // Use port from environment variable or default to 5000

// Middleware
app.use(cors()); // Enable CORS for all origins (for now)
app.use(express.json()); // Allow the server to accept JSON in request bodies

// Basic Route
app.get('/', (req, res) => {
  res.send('Donation Platform Backend is Running!');
});

// TODO: Add MongoDB Connection here later
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error: ', err));

// Use Authentication Routes
// Request starting with /api/auth will be handled by authRoutes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
