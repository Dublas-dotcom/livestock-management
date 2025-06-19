const Animal = require('../models/Animal');
const Vaccination = require('../models/Vaccination');
const HealthRecord = require('../models/HealthRecord');

/**
 * @desc    Get all animals with pagination
 * @route   GET /api/animals
 * @access  Private
 */
exports.getAllAnimals = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const animals = await Animal.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Animal.countDocuments();

        res.json({
            animals,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAnimals: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get animal by ID
 * @route   GET /api/animals/:id
 * @access  Private
 */
exports.getAnimalById = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) {
            return res.status(404).json({ message: 'Animal not found' });
        }
        res.json(animal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create new animal
 * @route   POST /api/animals
 * @access  Private
 */
exports.createAnimal = async (req, res) => {
    try {
        const {
            tagNumber,
            species,
            breed,
            dateOfBirth,
            gender,
            weight,
            healthStatus,
            notes
        } = req.body;

        const animal = new Animal({
            tagNumber,
            species,
            breed,
            dateOfBirth,
            gender,
            weight,
            healthStatus,
            notes,
            owner: req.user.id
        });

        await animal.save();
        res.status(201).json(animal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update animal
 * @route   PUT /api/animals/:id
 * @access  Private
 */
exports.updateAnimal = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        // Check if user owns the animal
        if (animal.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedAnimal = await Animal.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedAnimal);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete animal
 * @route   DELETE /api/animals/:id
 * @access  Private
 */
exports.deleteAnimal = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (!animal) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        // Check if user owns the animal
        if (animal.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await animal.remove();
        res.json({ message: 'Animal removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get animal vaccination history
 * @route   GET /api/animals/:id/vaccinations
 * @access  Private
 */
exports.getAnimalVaccinations = async (req, res) => {
    try {
        const vaccinations = await Vaccination.find({ animal: req.params.id })
            .sort({ date: -1 });
        res.json(vaccinations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get animal health records
 * @route   GET /api/animals/:id/health-records
 * @access  Private
 */
exports.getAnimalHealthRecords = async (req, res) => {
    try {
        const healthRecords = await HealthRecord.find({ animal: req.params.id })
            .sort({ date: -1 });
        res.json(healthRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 