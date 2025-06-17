/* 
 * Notification Routes for VaxWise application
 * Defines endpoints for notification management
 */

const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getNotification,
    createNotification,
    markAsRead,
    deleteNotification,
    createVaccinationReminder,
    getUpcomingNotifications
} = require('../controllers/notification');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Main notification routes
router.route('/')
    .get(getNotifications)
    .post(createNotification);

router.route('/:id')
    .get(getNotification)
    .delete(deleteNotification);

// Mark notification as read
router.route('/:id/read')
    .put(markAsRead);

// Vaccination reminder routes
router.route('/vaccination-reminder')
    .post(createVaccinationReminder);

// Get upcoming notifications
router.route('/upcoming')
    .get(getUpcomingNotifications);

module.exports = router; 