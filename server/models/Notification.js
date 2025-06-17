/* 
 * Notification Model for VaxWise application
 * Manages different types of notifications (vaccination reminders, health alerts, etc.)
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // Recipient information
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Notification details
    type: {
        type: String,
        enum: [
            'vaccination_due',
            'vaccination_overdue',
            'health_alert',
            'appointment_reminder',
            'system_alert',
            'subscription_update'
        ],
        required: true
    },
    
    // Content
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    
    // Related entities
    relatedAnimal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal'
    },
    relatedVaccine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vaccine'
    },
    
    // Delivery status
    deliveryStatus: {
        email: {
            sent: { type: Boolean, default: false },
            sentAt: Date,
            error: String
        },
        sms: {
            sent: { type: Boolean, default: false },
            sentAt: Date,
            error: String
        },
        push: {
            sent: { type: Boolean, default: false },
            sentAt: Date,
            error: String
        }
    },
    
    // Scheduling
    scheduledFor: {
        type: Date,
        required: true
    },
    repeatInterval: {
        value: Number,
        unit: {
            type: String,
            enum: ['hours', 'days', 'weeks'],
            default: 'days'
        }
    },
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'cancelled'],
        default: 'pending'
    },
    
    // Read status
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
// why use index?
// Index is a data structure that allows for faster retrieval of data from the database.
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ type: 1, status: 1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
    this.read = true;
    this.readAt = new Date();
    return this.save();
};

// Method to update delivery status
notificationSchema.methods.updateDeliveryStatus = function(channel, status, error = null) {
    this.deliveryStatus[channel] = {
        sent: status,
        sentAt: status ? new Date() : null,
        error: error
    };
    return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema); 