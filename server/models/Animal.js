/* 
 * Animal Model for VaxWise application
 * Tracks individual animal information and health records
 */

const mongoose = require('mongoose');

/**
 * Animal Schema
 * Defines the structure and validation rules for animal records
 */
const animalSchema = new mongoose.Schema({
    // Unique identifier for the animal
    tagNumber: {
        type: String,
        required: [true, 'Tag number is required'],
        unique: true,
        trim: true
    },
    
    // Species of the animal (e.g., cattle, sheep, goats)
    species: {
        type: String,
        required: [true, 'Species is required'],
        enum: ['cattle', 'sheep', 'goats', 'pigs', 'poultry'],
        trim: true
    },
    
    // Breed of the animal
    breed: {
        type: String,
        required: [true, 'Breed is required'],
        trim: true
    },
    
    // Date of birth
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    
    // Gender of the animal
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female'],
        trim: true
    },
    
    // Current weight in kilograms
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0, 'Weight cannot be negative']
    },
    
    // Current health status
    healthStatus: {
        type: String,
        required: [true, 'Health status is required'],
        enum: ['healthy', 'sick', 'under_treatment', 'quarantined'],
        default: 'healthy'
    },
    
    // Additional notes about the animal
    notes: {
        type: String,
        trim: true
    },
    
    // Reference to the owner (user)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    // Add timestamps for created and updated dates
    timestamps: true
});

// Create indexes for frequently queried fields
animalSchema.index({ tagNumber: 1 });
animalSchema.index({ owner: 1 });
animalSchema.index({ species: 1 });

// Add a method to get animal's age
animalSchema.methods.getAge = function() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

// Add a method to get animal's age in months
animalSchema.methods.getAgeInMonths = function() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    return (today.getFullYear() - birthDate.getFullYear()) * 12 + 
           (today.getMonth() - birthDate.getMonth());
};

// Add a virtual for next vaccination due date
animalSchema.virtual('nextVaccinationDue').get(function() {
    // This would be calculated based on vaccination history
    // Implementation would depend on your vaccination scheduling logic
    return null;
});

// Ensure virtuals are included when converting to JSON
animalSchema.set('toJSON', { virtuals: true });
animalSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Animal', animalSchema); 