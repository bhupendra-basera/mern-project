const mongoose = require('mongoose');
const CauseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true // Cause titles should be properly be unique
   },
   description: {
        type: String,
        required: true,

   },
   targetAmount: {
        type: Number,
        required: true,
        min: 0 // Target amount cannot be negative
   },
   raisedAmount: {
        type: Number,
        default: 0, //Starts at 0
        min: 0
   },
   image: {
        type: String, // URL or path to the cause image
        required: true
   },
   status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'], // Define possible statuses
        default: 'active'
   },
   createdAt: {
        type: Date,
        default: Date.now
   }
   // We might add fields for:
   // organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}, // If multiple organizations
   // donors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Optional: track donating users
   // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}] // Link to comments (future) 
});
// Add a virtual property for progress percentage (calculated, not stored)
CauseSchema.virtual('progress').get(function() {
    if (this.targetAmount === 0) return 0;
    return (this.raisedAmount / this.targetAmount) * 100;
});

const Cause = mongoose.model('Cause', CauseSchema);

module.exports = Cause;