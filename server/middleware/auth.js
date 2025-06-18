/* 
 * Authentication Middleware for VaxWise application
 * Handles JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const { AppError } = require('./error');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id);
            if (!req.user) {
                return next(new AppError('User not found', 404));
            }

            next();
        } catch (err) {
            return next(new AppError('Not authorized to access this route', 401));
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