const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/animals
 * @desc    Get all animals with pagination
 * @access  Private
 */
router.get('/', auth.protect, animalController.getAllAnimals);

/**
 * @route   GET /api/animals/:id
 * @desc    Get animal by ID
 * @access  Private
 */
router.get('/:id', auth.protect, animalController.getAnimalById);

/**
 * @route   POST /api/animals
 * @desc    Create new animal
 * @access  Private
 */
router.post('/', auth.protect, animalController.createAnimal);

/**
 * @route   PUT /api/animals/:id
 * @desc    Update animal
 * @access  Private
 */
router.put('/:id', auth.protect, animalController.updateAnimal);

/**
 * @route   DELETE /api/animals/:id
 * @desc    Delete animal
 * @access  Private
 */
router.delete('/:id', auth.protect, animalController.deleteAnimal);

/**
 * @route   GET /api/animals/:id/vaccinations
 * @desc    Get animal vaccination history
 * @access  Private
 */
router.get('/:id/vaccinations', auth.protect, animalController.getAnimalVaccinations);

/**
 * @route   GET /api/animals/:id/health-records
 * @desc    Get animal health records
 * @access  Private
 */
router.get('/:id/health-records', auth.protect, animalController.getAnimalHealthRecords);

module.exports = router; 