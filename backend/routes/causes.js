const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause'); //Import the Caues model
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware
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


// @route POST /api/causes
// @desc  Create a new cause
// @access Private (requires authentication)
router.post('/',authMiddleware, async (req, res) => {
    const { title, description, targetAmount, image } = req.body;

    try {
        // Basic validation (check for required fields)
        if(!title || !description || !targetAmount || !image) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }
        
        // Optional: Check if a cause with the same title already exists
        let cause = await Cause.findOne({ title });
        if (cause) {
            return res.status(400).json({ msg: 'Cause with this title already exists' });
        }
        
        // Create a new cause instance
        cause = new Cause({
            title,
            description,
            targetAmount,
            image
            // raisedAmount defaults to 0 as defined in model
            // createdAt defaults to now as defined in model
            // status defaults to 'active' as defined in model
        });

        // Save the new cause to the database
        await cause.save();

        // Send back the newly created cause with 201 status (Created)
        res.status(201).json(cause);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  PUT /api/causes/:id
// @desc   Update a cause by ID
// @access Private (requires authentication)
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, targetAmount, raisedAmount, image, status } =  req.body;

    // Build an update object with fields that are present in the request body
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (targetAmount !== undefined) updateFields.targetAmount = targetAmount; // Check for undefined or null
    if (raisedAmount !== undefined) updateFields.raisedAmount = raisedAmount;
    if (image) updateFields.image = image;
    if (status) updateFields.status = status;

    try {
        let cause = await Cause.findById(req.params.id);

        if(!cause) {
            return res.status(404).json({ msg: 'Cause not foud' });
        }

        // TODO: Add Authorization Check Here!
        // In a real app, you would check if the logged-in user (req.user.id)
        // has permission to update this specific caue (e.g., are they an admin?).
        // For now, any logged-in user can technically call this, but ideally restricted.
        // if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'User not authorized' });}
    
        // Find the cause by ID and update it
        cause = await Cause.findByIdAndUpdate(
            req.params.id, // ID to find
            { $set: updateFields }, // Update operations ($set is common)
            { new: true} // Options: return the NEW updated documnet
        );

        res.json(cause); // Send back the updated cause
    } catch (err) {
        console.error(err.message);
        // Handle invalid ID format error
        if (err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Cause not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route  Delete /api/causes/:id
// @desc   Delete a cause by ID
// @access Private (requires authentication)
router.delete('/:id',authMiddleware, async (req,res) => {
    try{
        const cause = await Cause.findById(req.params.id);

        if(!cause) {
            return res.status(404).json({ msg: 'Cause not found'});
        }

        // TODO: Add Authorization Check Here! (Similar to update)
        // Ensure the logged-in user has permission to delete this cause.
        // if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'User not authorized' }); }

        // Remove the cause from the database
        await Cause.findByIdAndDelete(req.params.id); // or await cause.remove(); for older Mongoose versions

        res.json({ msg: 'Cause removed successfully' }); // Send a success message
    } catch (err) {
        console.error(err.message);
        // Handle invalid ID format error
        if (err.kind === 'ObjectId'){
            return res.status(404).json({ msg: 'Cause not found'});
        }
        res.status(500).send('Server Error');
    }
});
module.exports = router;