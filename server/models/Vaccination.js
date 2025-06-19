const mongoose = require('mongoose');

/**
 * Vaccination Schema
 * Defines the structure and validation rules for vaccination records
 */
const vaccinationSchema = new mongoose.Schema({
    // Reference to the animal that received the vaccination
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
        required: [true, 'Animal reference is required']
    },
    
    // Name of the vaccine
    vaccineName: {
        type: String,
        required: [true, 'Vaccine name is required'],
        trim: true
    },
    
    // Date when the vaccination was administered
    date: {
        type: Date,
        required: [true, 'Vaccination date is required'],
        default: Date.now
    },
    
    // Next due date for this vaccination
    nextDueDate: {
        type: Date,
        required: [true, 'Next due date is required']
    },
    
    // Batch number of the vaccine
    batchNumber: {
        type: String,
        required: [true, 'Batch number is required'],
        trim: true
    },
    
    // Dosage administered
    dosage: {
        amount: {
            type: Number,
            required: [true, 'Dosage amount is required']
        },
        unit: {
            type: String,
            required: [true, 'Dosage unit is required'],
            enum: ['ml', 'cc', 'dose'],
            default: 'ml'
        }
    },
    
    // Route of administration
    route: {
        type: String,
        required: [true, 'Route of administration is required'],
        enum: ['intramuscular', 'subcutaneous', 'intravenous', 'oral', 'intranasal'],
        trim: true
    },
    
    // Site of administration
    site: {
        type: String,
        required: [true, 'Site of administration is required'],
        trim: true
    },
    
    // Reference to the veterinarian who administered the vaccine
    administeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Administrator reference is required']
    },
    
    // Any adverse reactions observed
    adverseReactions: {
        type: String,
        trim: true
    },
    
    // Additional notes about the vaccination
    notes: {
        type: String,
        trim: true
    },
    
    // Status of the vaccination
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'missed', 'cancelled'],
        default: 'completed'
    }
}, {
    // Add timestamps for created and updated dates
    timestamps: true
});

// Create indexes for frequently queried fields
vaccinationSchema.index({ animal: 1, date: -1 });
vaccinationSchema.index({ nextDueDate: 1 });
vaccinationSchema.index({ administeredBy: 1 });

// Add a method to check if vaccination is overdue
vaccinationSchema.methods.isOverdue = function() {
    return this.nextDueDate < new Date() && this.status === 'completed';
};

// Add a method to calculate days until next vaccination
vaccinationSchema.methods.daysUntilNext = function() {
    const today = new Date();
    const nextDue = new Date(this.nextDueDate);
    const diffTime = nextDue - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Add a virtual for vaccination status
vaccinationSchema.virtual('isUpToDate').get(function() {
    return this.nextDueDate > new Date();
});

// Ensure virtuals are included when converting to JSON
vaccinationSchema.set('toJSON', { virtuals: true });
vaccinationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Vaccination', vaccinationSchema); 