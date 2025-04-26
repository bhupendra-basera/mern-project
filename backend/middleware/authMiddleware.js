const jwt = require('jsonwebtoken');

//Get JWT secret from environment variables (make sure .env file is loaded in index.js)
const jwtSecret = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
    // Get token from the header
    // The token is typically sent as 'Bearer TOKEN_STRING'
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Get the token string after 'bearer'

    // Add log to see if token is received
    //console.log('Auth Middleware: Received Token:', token ? token.substring(0, 10) + '...' : 'No token'); // Log snippet of token or 'No token'


    // check if no token
    if (!token) {
        //console.log('Auth Middleware: No token provided, denying access.'); // Log why
        return res.status(401).json({ msg: 'No token, authorization denied' }); // 401 Unauthorized
    }

    // verify token
    try {
        // jwt.verify takes the token, the secret, and a callback or returns decoded payload
        const decoded = jwt.verify(token, jwtSecret);

         // Add log to see the decoded payload
        //console.log('Auth Middleware: Token decoded. Payload:', decoded);

        // Add user from payload to the request object
        // Remember, the payload had { user: { id: user._id }}
        req.user = decoded.user;

        // Add log to see what is being set on req.user
        //console.log('Auth Middleware: Setting req.user:', req.user);


        next(); // Move to the next middleware or route handler
    } catch (err) {
        //console.error('Auth Middleware: Token verification failed:', err.message); // Log the specific verification error
        res.status(403).json({ msg: 'Token is not valid' }); // 403 Forbidden (invalid token)
    }
};