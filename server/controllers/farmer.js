/* 
 * Farmer Controller for VaxWise application
 * Handles farmer-related business logic
 */

const User = require('../models/User');
const { AppError } = require('../middleware/error');

// @desc    Get all farmers
// @route   GET /api/farmer
// @access  Private
exports.getFarmers = async (req, res, next) => {
    try {
        const farmers = await User.find({ role: 'farmer' });
        res.status(200).json({
            success: true,
            count: farmers.length,
            data: farmers
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single farmer
// @route   GET /api/farmer/:id
// @access  Private
exports.getFarmer = async (req, res, next) => {
    try {
        const farmer = await User.findOne({ _id: req.params.id, role: 'farmer' });
        if (!farmer) {
            return next(new AppError('Farmer not found', 404));
        }
        res.status(200).json({
            success: true,
            data: farmer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new farmer
// @route   POST /api/farmer
// @access  Private
exports.createFarmer = async (req, res, next) => {
    try {
        const farmer = await User.create({
            ...req.body,
            role: 'farmer'
        });
        res.status(201).json({
            success: true,
            data: farmer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update farmer
// @route   PUT /api/farmer/:id
// @access  Private
exports.updateFarmer = async (req, res, next) => {
    try {
        const farmer = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!farmer) {
            return next(new AppError('Farmer not found', 404));
        }
        res.status(200).json({
            success: true,
            data: farmer
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete farmer
// @route   DELETE /api/farmer/:id
// @access  Private
exports.deleteFarmer = async (req, res, next) => {
    try {
        const farmer = await User.findByIdAndDelete(req.params.id);
        if (!farmer) {
            return next(new AppError('Farmer not found', 404));
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
}; 