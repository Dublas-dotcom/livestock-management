/* 
 * Farmer Routes for VaxWise application
 * Handles farmer-related operations
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Placeholder controller functions
const {
    getFarmers,
    getFarmer,
    createFarmer,
    updateFarmer,
    deleteFarmer
} = require('../controllers/farmer');

// Routes
router.route('/')
    .get(protect, getFarmers)
    .post(protect, createFarmer);

router.route('/:id')
    .get(protect, getFarmer)
    .put(protect, updateFarmer)
    .delete(protect, deleteFarmer);

module.exports = router; 