/* 
 * Notification Controller for VaxWise application
 * Handles notification creation, delivery, and management
 */

const Notification = require('../models/Notification');
const Animal = require('../models/Animal');
const { AppError } = require('../middleware/error');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort('-createdAt')
            .populate('relatedAnimal')
            .populate('relatedVaccine');

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
exports.getNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user.id
        }).populate('relatedAnimal').populate('relatedVaccine');

        if (!notification) {
            return next(new AppError('Notification not found', 404));
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
exports.createNotification = async (req, res, next) => {
    try {
        req.body.recipient = req.user.id;
        const notification = await Notification.create(req.body);

        // Send notification through configured channels
        await sendNotification(notification);

        res.status(201).json({
            success: true,
            data: notification
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user.id
        });

        if (!notification) {
            return next(new AppError('Notification not found', 404));
        }

        await notification.markAsRead();

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user.id
        });

        if (!notification) {
            return next(new AppError('Notification not found', 404));
        }

        await notification.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create vaccination reminder
// @route   POST /api/notifications/vaccination-reminder
// @access  Private
exports.createVaccinationReminder = async (req, res, next) => {
    try {
        const { animalId, vaccineId, dueDate } = req.body;

        const animal = await Animal.findOne({
            _id: animalId,
            farmer: req.user.id
        }).populate('vaccinations.vaccine');

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        const notification = await Notification.create({
            recipient: req.user.id,
            type: 'vaccination_due',
            title: 'Vaccination Due',
            message: `Vaccination due for ${animal.name} on ${new Date(dueDate).toLocaleDateString()}`,
            priority: 'high',
            relatedAnimal: animalId,
            relatedVaccine: vaccineId,
            scheduledFor: dueDate
        });

        // Send notification through configured channels
        await sendNotification(notification);

        res.status(201).json({
            success: true,
            data: notification
        });
    } catch (err) {
        next(err);
    }
};

// Helper function to send notifications through different channels
const sendNotification = async (notification) => {
    try {
        const user = await User.findById(notification.recipient);

        // Send email notification
        if (user.notificationPreferences.email) {
            // TODO: Implement email sending
            await notification.updateDeliveryStatus('email', true);
        }

        // Send SMS notification
        if (user.notificationPreferences.sms) {
            try {
                await twilioClient.messages.create({
                    body: notification.message,
                    to: user.phone,
                    from: process.env.TWILIO_PHONE_NUMBER
                });
                await notification.updateDeliveryStatus('sms', true);
            } catch (error) {
                await notification.updateDeliveryStatus('sms', false, error.message);
            }
        }

        // Send push notification
        if (user.notificationPreferences.push) {
            // TODO: Implement push notification
            await notification.updateDeliveryStatus('push', true);
        }

        notification.status = 'sent';
        await notification.save();
    } catch (error) {
        console.error('Error sending notification:', error);
        notification.status = 'failed';
        await notification.save();
    }
};

// @desc    Get upcoming notifications
// @route   GET /api/notifications/upcoming
// @access  Private
exports.getUpcomingNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.id,
            scheduledFor: { $gt: new Date() },
            status: 'pending'
        })
            .sort('scheduledFor')
            .populate('relatedAnimal')
            .populate('relatedVaccine');

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        next(err);
    }
}; 