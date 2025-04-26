const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import auth Middleware
const Donation = require('../models/Donation'); // Import Donation model
const Cause = require('../models/Cause'); // Import Cause model (needed to update raised amount)

// @route  POST /api/donations
// @desc   Record a new donation (initial step before payment confirmation)
// @access Private (require authentication for logged-in donations)
router.post('/', authMiddleware, async(req,res) => {
    // Get donation details from the request body
    // Note: amount will likely come from frontend after user input,
    // causeId will come from frontend (e.g., form the cause detials page)

    const { causeId, amount, currency, isAnonymous } = req.body;
    // Get user ID from the authenticated user
    const userId = req.user.id;

    try{
        // Basic validation
        if(!causeId || !amount || amount <= 0){
            return res.status(400).json({ msg: 'Please provide cause ID and a valid amount' });
        }

        // Find the cause to ensure it exists
        const cause = await Cause.findById(causeId);
        if(!cause){
            return res.status(404).json({ msg: 'Cause not found' });
        }

        // TODO : Payment Gateway Integration Logic will START here!
        // In a real flow, you would initiate the payment process with the gateway here.
        // This POST request might just *initiate* the transaction.
        // The actual Donation document might be created or updated later.
        // based on a webhook from the payment gateway confirming payment success.
        // For now, we'll create a 'pending' donation record as a placeholder.

        // Create a new pending donation record
        const newDonation = new Donation({
            user: userId,
            cause: causeId,
            amount,
            currency: currency || 'INR', // Use provided currency or default
            isAnonymous: isAnonymous || false, // Use provided anonymity or default
            paymentStatus: 'pending', // Set status as pending
            // paymentGatewayTransactionId and paymentGatewayResponse will be added later
        });
        // Save the pending donation to the database
        await newDonation.save();

        // TODO: update the Cause's raisedAmount only AFTER payment is CONFIRMED!
        // Updating here is premature. We'll move this logic to a webhook handler
        // or a payment confirmation step later.
        // For demonstration , let's add a placeholder comment;
        // await Cause.findByIdAndUpdate(causeId, { $inc: {raisedAmount: amount } });
        // Note: $inc is an atomic operator, good for increment number

        // Send back the pending donation record
        res.status(201).json(newDonation);

    } catch(err) {
        console.log(err.message);
        // Handle invalid Cause ID format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Cause not found'});
        }
        res.status(500).send('Server Error');
    }
});

// TODO: Add GET routes to fetch user's donations or donations for a cause later

module.exports = router;