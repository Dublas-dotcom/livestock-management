/* 
 * Authentication Middleware for VaxWise application
 * Protects routes and verifies JWT tokens
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Verify token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (err) {
        next(err);
    }
};

// Middleware to authorize roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// Middleware to check subscription status
exports.checkSubscription = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Check if user has active subscription
        if (!user.subscriptionTier) {
            return res.status(403).json({
                success: false,
                message: 'Subscription required to access this feature'
            });
        }

        // Add subscription info to request
        req.subscription = user.subscriptionTier;
        next();
    } catch (err) {
        next(err);
    }
}; 