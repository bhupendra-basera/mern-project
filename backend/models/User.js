const mongoose = require('mongoose');

// Define the User Schema
const UseSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true // Removes whitespace from both ends of a sting
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // store email in lowercase
        // Basic email format validation (more robust validation can be added)
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required: true,
        minlenght: 6, // Minimum password length
    },
    // We can add more fields later, like:
    // socialID: {type: String}, for social logins
    // socialProvider: {type: String}
    createdAt:{
        type: Date,
        default: Date.now 
    }
    });
// Create a model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = User; // Export the model to be used in other parts of the application

