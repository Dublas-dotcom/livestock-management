const mongoose = require('mongoose');

/**
 * HealthRecord Schema
 * Defines the structure and validation rules for animal health records
 */
const healthRecordSchema = new mongoose.Schema({
    // Reference to the animal
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
        required: [true, 'Animal reference is required']
    },
    
    // Date of the health record
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    
    // Type of health record
    recordType: {
        type: String,
        required: [true, 'Record type is required'],
        enum: ['checkup', 'treatment', 'surgery', 'injury', 'disease', 'other'],
        trim: true
    },
    
    // Diagnosis or condition
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis is required'],
        trim: true
    },
    
    // Treatment provided
    treatment: {
        type: String,
        required: [true, 'Treatment is required'],
        trim: true
    },
    
    // Medications prescribed
    medications: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        dosage: {
            amount: Number,
            unit: {
                type: String,
                enum: ['mg', 'ml', 'tablet', 'capsule'],
                default: 'mg'
            }
        },
        frequency: String,
        duration: String,
        notes: String
    }],
    
    // Vital signs
    vitalSigns: {
        temperature: {
            value: Number,
            unit: {
                type: String,
                enum: ['C', 'F'],
                default: 'C'
            }
        },
        heartRate: Number,
        respiratoryRate: Number,
        weight: {
            value: Number,
            unit: {
                type: String,
                enum: ['kg', 'lbs'],
                default: 'kg'
            }
        }
    },
    
    // Reference to the veterinarian who created the record
    veterinarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Veterinarian reference is required']
    },
    
    // Follow-up date if required
    followUpDate: {
        type: Date
    },
    
    // Status of the health record
    status: {
        type: String,
        enum: ['active', 'resolved', 'ongoing', 'referred'],
        default: 'active'
    },
    
    // Additional notes
    notes: {
        type: String,
        trim: true
    },
    
    // Attachments (e.g., lab results, images)
    attachments: [{
        type: {
            type: String,
            enum: ['image', 'document', 'lab_result'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        description: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    // Add timestamps for created and updated dates
    timestamps: true
});

// Create indexes for frequently queried fields
healthRecordSchema.index({ animal: 1, date: -1 });
healthRecordSchema.index({ veterinarian: 1 });
healthRecordSchema.index({ recordType: 1 });
healthRecordSchema.index({ status: 1 });

// Add a method to check if follow-up is needed
healthRecordSchema.methods.needsFollowUp = function() {
    return this.followUpDate && this.followUpDate > new Date();
};

// Add a method to calculate days until follow-up
healthRecordSchema.methods.daysUntilFollowUp = function() {
    if (!this.followUpDate) return null;
    const today = new Date();
    const followUp = new Date(this.followUpDate);
    const diffTime = followUp - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Add a virtual for record age
healthRecordSchema.virtual('recordAge').get(function() {
    const today = new Date();
    const recordDate = new Date(this.date);
    const diffTime = today - recordDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are included when converting to JSON
healthRecordSchema.set('toJSON', { virtuals: true });
healthRecordSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema); 