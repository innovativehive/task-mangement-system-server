import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

    // Check if token is provided
    if (!token) {
        return res.status(401).send({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ success: false, message: 'Invalid token.' });
        }

        // If token is valid, save the decoded info to request for use in other routes
        req.user = decoded; // This will contain the user's id, name, and role
        next(); // Proceed to the next middleware or route handler
    });
};

export default verifyToken;
