const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecordController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/health-records
 * @desc    Get all health records with pagination
 * @access  Private
 */
router.get('/', auth, healthRecordController.getAllHealthRecords);

/**
 * @route   GET /api/health-records/:id
 * @desc    Get health record by ID
 * @access  Private
 */
router.get('/:id', auth, healthRecordController.getHealthRecordById);

/**
 * @route   POST /api/health-records
 * @desc    Create new health record
 * @access  Private
 */
router.post('/', auth, healthRecordController.createHealthRecord);

/**
 * @route   PUT /api/health-records/:id
 * @desc    Update health record
 * @access  Private
 */
router.put('/:id', auth, healthRecordController.updateHealthRecord);

/**
 * @route   DELETE /api/health-records/:id
 * @desc    Delete health record
 * @access  Private
 */
router.delete('/:id', auth, healthRecordController.deleteHealthRecord);

/**
 * @route   GET /api/health-records/animal/:animalId
 * @desc    Get all health records for a specific animal
 * @access  Private
 */
router.get('/animal/:animalId', auth, healthRecordController.getAnimalHealthRecords);

/**
 * @route   GET /api/health-records/follow-up
 * @desc    Get health records requiring follow-up
 * @access  Private
 */
router.get('/follow-up', auth, healthRecordController.getFollowUpRecords);

/**
 * @route   POST /api/health-records/:id/attachments
 * @desc    Add attachment to health record
 * @access  Private
 */
router.post('/:id/attachments', auth, healthRecordController.addAttachment);

/**
 * @route   DELETE /api/health-records/:id/attachments/:attachmentId
 * @desc    Remove attachment from health record
 * @access  Private
 */
router.delete('/:id/attachments/:attachmentId', auth, healthRecordController.removeAttachment);

module.exports = router; 