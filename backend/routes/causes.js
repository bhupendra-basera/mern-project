const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause'); //Import the Caues model

// @route GET /api/causes
// @desc  GET all causes
// @access Public 
router.get('/', async (req, res) => {
    try {
        const causes = await Cause.find().sort({ createdAt: -1 }); // Find all causes, sort by creation date descending
        res.json(causes); // Send the array of causes as JSON 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET /api/causes/:id
// @desc   Get single cause by ID
// @access Public
router.get('/:id', async (req, res) => {
    try{
        // Get the cause ID from the URL parameters (e.g., /api/causes/12345)
        const cause = await Cause.findById(req.params.id);

        if (!cause) {
            return res.status(404).json({ msg: 'Cause not found' }); // 404 Not Found
        }

        // Mongoose virtuals are not included by default, you might need to explicitly request them or use .lean()
        // For simple virtuals like progress, they are often calculated on the frontend based on raised/target amounts.
        // If you need complex virtuals on the backend, you might need to use .lean() and calculate manually or use toJSON options.
        // For now, we'll send the basic cause data and let the frontend calculate progress.
        
        res.json(cause); // Send the single cause document as JSON
    } catch (err) {
        console.error(err.message);
        // Check if the ID format is invalid (Mongoose will throw a CastError)
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: "Cause not font"});
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;