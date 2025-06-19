const express = require('express');
const router = express.Router();
const vaccinationController = require('../controllers/vaccinationController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/vaccinations
 * @desc    Get all vaccinations with pagination
 * @access  Private
 */
router.get('/', auth, vaccinationController.getAllVaccinations);

/**
 * @route   GET /api/vaccinations/:id
 * @desc    Get vaccination by ID
 * @access  Private
 */
router.get('/:id', auth, vaccinationController.getVaccinationById);

/**
 * @route   POST /api/vaccinations
 * @desc    Create new vaccination record
 * @access  Private
 */
router.post('/', auth, vaccinationController.createVaccination);

/**
 * @route   PUT /api/vaccinations/:id
 * @desc    Update vaccination record
 * @access  Private
 */
router.put('/:id', auth, vaccinationController.updateVaccination);

/**
 * @route   DELETE /api/vaccinations/:id
 * @desc    Delete vaccination record
 * @access  Private
 */
router.delete('/:id', auth, vaccinationController.deleteVaccination);

/**
 * @route   GET /api/vaccinations/animal/:animalId
 * @desc    Get all vaccinations for a specific animal
 * @access  Private
 */
router.get('/animal/:animalId', auth, vaccinationController.getAnimalVaccinations);

/**
 * @route   GET /api/vaccinations/upcoming
 * @desc    Get upcoming vaccinations
 * @access  Private
 */
router.get('/upcoming', auth, vaccinationController.getUpcomingVaccinations);

/**
 * @route   GET /api/vaccinations/overdue
 * @desc    Get overdue vaccinations
 * @access  Private
 */
router.get('/overdue', auth, vaccinationController.getOverdueVaccinations);

module.exports = router; 