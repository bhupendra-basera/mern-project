// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // We'll use this soon

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});