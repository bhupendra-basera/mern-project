const jwt = require('jsonwebtoken');

//Get JWT secret from environment variables (make sure .env file is loaded in index.js)
const jwtSecret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
    // Get token from the header
    // The token is typically sent as 'Bearer TOKEN_STRING'
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Get the token string after 'bearer'

    // check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' }); // 401 Unauthorized
    }

    // verify token
    try {
        // jwt.verify takes the token, the secret, and a callback or returns decoded payload
        const decoded = jwt.verify(token, jwtSecret);

        // Add user from payload to the request object
        // Remember, the payload had { user: { id: user._id }}
        req.user = decoded.user;
        next(); // Move to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ msg: 'Token is not valid' }); // 403 Forbidden (invalid token)
    }
};