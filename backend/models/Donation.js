const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    // Reference to the User who made the donation
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // 'User' refers to the User model
        required: true // Logged-in donations require a user
        // If anonymous donations are allowed, this might not be required,
        // but we need another way to identify anonymous donors if needed later.
        // For now, let's assume logged-in donations.
    },
    // Reference to the Cause the donation is for
    cause: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cause', // 'Cause' refers to the Cause model
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1 // Minimum donation amount
    },
    currency: {
        type: String,
        required: true,
        default: 'INR'  // Default currency
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'comleted', 'failed', 'refunded'], // Possible statuses
        default: 'pending' // Initial status before payment confirmation
    },
    // Store the transaction ID from the payment gateway
    paymentGatewayTransactionId: {
        type: String,
        // Not required initially, but will be required upon 'completed' status
        sparse: true // Allows null values, but ensures uniqueness for non-null
    },
    // Optionally store the full response object from the payment gateway
    paymentGatewayResponse: {
        type: Object // Store the raw response data
    },
    donatedAt: {
        type: Date,
        default: Date.now
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
    // Could add fields like:
    // receiptUrl: {type: String }, // Link to the generated receipt/certificate
    // invoiceUrl: { type: String} // Link to the generated invoice
});

const Donation = mongoose.model('Donation',DonationSchema);
module.exports = Donation;