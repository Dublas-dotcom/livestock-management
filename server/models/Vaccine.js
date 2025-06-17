/* 
 * Vaccine Model for VaxWise application
 * Manages vaccine information and vaccination schedules
 */

const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
    // Basic vaccine information
    name: {
        type: String,
        required: [true, 'Please provide vaccine name'],
        trim: true
    },
    manufacturer: {
        type: String,
        required: [true, 'Please provide manufacturer name']
    },
    description: {
        type: String,
        required: [true, 'Please provide vaccine description']
    },
    
    // Vaccine specifications
    type: {
        type: String,
        enum: ['live', 'inactivated', 'subunit', 'toxoid', 'conjugate'],
        required: true
    },
    targetSpecies: [{
        type: String,
        enum: ['cattle', 'sheep', 'goat', 'pig', 'poultry', 'other'],
        required: true
    }],
    
    // Administration details
    dosage: {
        amount: Number,
        unit: {
            type: String,
            enum: ['ml', 'cc', 'dose'],
            default: 'ml'
        }
    },
    route: {
        type: String,
        enum: ['intramuscular', 'subcutaneous', 'oral', 'intranasal'],
        required: true
    },
    
    // Schedule information
    schedule: {
        initialAge: {
            value: Number,
            unit: {
                type: String,
                enum: ['days', 'weeks', 'months'],
                default: 'weeks'
            }
        },
        boosterInterval: {
            value: Number,
            unit: {
                type: String,
                enum: ['weeks', 'months', 'years'],
                default: 'months'
            }
        },
        totalDoses: {
            type: Number,
            default: 1
        }
    },
    
    // Storage requirements
    storage: {
        temperature: {
            min: Number,
            max: Number,
            unit: {
                type: String,
                enum: ['celsius', 'fahrenheit'],
                default: 'celsius'
            }
        },
        shelfLife: {
            value: Number,
            unit: {
                type: String,
                enum: ['days', 'months', 'years'],
                default: 'months'
            }
        }
    },
    
    // Regulatory information
    registrationNumber: String,
    expiryDate: Date,
    batchNumber: String,
    
    // Additional information
    contraindications: [String],
    sideEffects: [String],
    notes: String,
    
    // Status
    status: {
        type: String,
        enum: ['active', 'discontinued', 'recalled'],
        default: 'active'
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
vaccineSchema.index({ name: 1, manufacturer: 1 });
vaccineSchema.index({ targetSpecies: 1 });
vaccineSchema.index({ status: 1 });

module.exports = mongoose.model('Vaccine', vaccineSchema); 