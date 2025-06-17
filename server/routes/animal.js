/* 
 * Animal Routes for VaxWise application
 * Defines endpoints for livestock management
 */

const express = require('express');
const router = express.Router();
const {
    getAnimals,
    getAnimal,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    addVaccination,
    updateVaccination,
    deleteVaccination,
    addMedicalRecord,
    getVaccinationSchedule
} = require('../controllers/animal');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Main animal routes
router.route('/')
    .get(getAnimals)
    .post(createAnimal);

router.route('/:id')
    .get(getAnimal)
    .put(updateAnimal)
    .delete(deleteAnimal);

// Vaccination routes
router.route('/:id/vaccinations')
    .post(addVaccination);

router.route('/:id/vaccinations/:vaccinationId')
    .put(updateVaccination)
    .delete(deleteVaccination);

// Medical record routes
router.route('/:id/medical')
    .post(addMedicalRecord);

// Schedule routes
router.route('/:id/schedule')
    .get(getVaccinationSchedule);

module.exports = router; 