const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware


//We'll need a JWT secret key. Add this to your .env file!
// JWT_SECRET= your_super_secret_key_here (make it strong and unique)

//@route POST /apt/auth/signup
//@desc Register a new user
//@access Public (anyone can access)
router.post('/signup', async (req, res) =>{
    //implementation goes here
    const { username, email, password } = req.body; //Get data from request body
    try{
        
        // Check if user already exists (by email or username)
        let user = await User.findOne({ $or: [{ email }, { username }]});
        if (user){
            return res.status(400).json({ msg: "User already exists with this email or username"});
        }

        // Create a new user instance
        user = new User({
            username,
            email,
            password // Store plain password for now, will hash next
        });
        // Hash the password BEFORE saving
        const salt = await bcrypt.genSalt(10); // Generate a salt
        user.password = await bcrypt.hash(password, salt) // Hash the password with the salt

        // Save the user to the database
        await user.save();

        // In a real app, you might automatically log in the user after signup
        // or send a confirmation email. For now, just send a success message.

        res.status(201).json({msg: "User registered successfully!",user: { id: user._id, username: user.username, email: user.email}});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } 
});

//@route POST /api/auth/login
//@desc Authenticate user & get token
//@acceess Public (anyone can access)
router.post('/login', async (req, res) =>{
    //implementation goes here
    const { email, password } = req.body; //Get email and password from request body
    try {
        // Check if user exists by email
        let user = await User.findOne({ email });
        if (!user) {
            // Use a generic message for security
            return res.status(400).json({ msg: "Invalid credentials"});
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Use a generic message for security
            return res.status(400).json({ msg: "Invalid crendentials"});
        }

        //If credentials are valid, create and return a JWT
        const payload ={
            user: {
                id: user._id // Use the user's ID as the payload
            }
        };

        jwt.sign(
            payload, // Data to include in the token
            process.env.JWT_SECRET, // Your secret key from .env 
            { expiresIn: '1h' }, // Token expiration time(e.g., 1 hour) - adjust as needed
            (err, token) => {
                if (err) throw err;
                // Send the token back to the client
                res.json({ token });
            }
        );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

});

// @route GET /api/auth/user
// @desc Get logged in user data
// @access Private (only authenticated users can access)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        // req.user was set by the authMiddleware with the user's ID from the token
        const user = await User.findById(req.user.id).select('-password'); // Find user by ID, exclude password hash

        if(!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user); // Send back the user data (without password)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router; // Export the router