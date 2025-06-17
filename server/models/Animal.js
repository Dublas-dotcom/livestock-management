/* 
 * Animal Model for VaxWise application
 * Tracks individual animal information and health records
 */

const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    // Basic animal information
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide an animal name'],
        trim: true
    },
    species: {
        type: String,
        required: [true, 'Please specify the animal species'],
        enum: ['cattle', 'sheep', 'goat', 'pig', 'poultry', 'other']
    },
    breed: {
        type: String,
        required: [true, 'Please specify the breed']
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    
    // Identification
    tagNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    microchipNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    
    // Health records
    healthStatus: {
        type: String,
        enum: ['healthy', 'sick', 'recovering', 'quarantined'],
        default: 'healthy'
    },
    weight: [{
        date: Date,
        value: Number,
        unit: {
            type: String,
            enum: ['kg', 'lbs'],
            default: 'kg'
        }
    }],
    
    // Vaccination history
    vaccinations: [{
        vaccine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vaccine',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        nextDueDate: Date,
        administeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        batchNumber: String,
        notes: String
    }],
    
    // Medical history
    medicalHistory: [{
        date: Date,
        condition: String,
        treatment: String,
        veterinarian: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: String
    }],
    
    // Breeding information
    breedingHistory: [{
        date: Date,
        type: {
            type: String,
            enum: ['mating', 'pregnancy', 'birth', 'weaning']
        },
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal'
        },
        notes: String
    }],
    
    // Status
    status: {
        type: String,
        enum: ['active', 'sold', 'deceased', 'transferred'],
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

// Index for efficient queryin
animalSchema.index({ farmer: 1, tagNumber: 1 });
animalSchema.index({ farmer: 1, species: 1 });
animalSchema.index({ 'vaccinations.nextDueDate': 1 });

module.exports = mongoose.model('Animal', animalSchema); 