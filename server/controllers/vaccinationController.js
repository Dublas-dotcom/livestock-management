const Vaccination = require('../models/Vaccination');
const Animal = require('../models/Animal');

/**
 * @desc    Get all vaccinations with pagination
 * @route   GET /api/vaccinations
 * @access  Private
 */
exports.getAllVaccinations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const vaccinations = await Vaccination.find()
            .populate('animal', 'tagNumber species breed')
            .populate('administeredBy', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 });

        const total = await Vaccination.countDocuments();

        res.json({
            vaccinations,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalVaccinations: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get vaccination by ID
 * @route   GET /api/vaccinations/:id
 * @access  Private
 */
exports.getVaccinationById = async (req, res) => {
    try {
        const vaccination = await Vaccination.findById(req.params.id)
            .populate('animal', 'tagNumber species breed')
            .populate('administeredBy', 'name');

        if (!vaccination) {
            return res.status(404).json({ message: 'Vaccination record not found' });
        }

        res.json(vaccination);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create new vaccination record
 * @route   POST /api/vaccinations
 * @access  Private
 */
exports.createVaccination = async (req, res) => {
    try {
        const {
            animal,
            vaccineName,
            date,
            nextDueDate,
            batchNumber,
            dosage,
            route,
            site,
            adverseReactions,
            notes
        } = req.body;

        // Check if animal exists
        const animalExists = await Animal.findById(animal);
        if (!animalExists) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        const vaccination = new Vaccination({
            animal,
            vaccineName,
            date,
            nextDueDate,
            batchNumber,
            dosage,
            route,
            site,
            administeredBy: req.user.id,
            adverseReactions,
            notes
        });

        await vaccination.save();
        res.status(201).json(vaccination);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update vaccination record
 * @route   PUT /api/vaccinations/:id
 * @access  Private
 */
exports.updateVaccination = async (req, res) => {
    try {
        const vaccination = await Vaccination.findById(req.params.id);
        if (!vaccination) {
            return res.status(404).json({ message: 'Vaccination record not found' });
        }

        // Check if user is the administrator of the vaccination
        if (vaccination.administeredBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedVaccination = await Vaccination.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedVaccination);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete vaccination record
 * @route   DELETE /api/vaccinations/:id
 * @access  Private
 */
exports.deleteVaccination = async (req, res) => {
    try {
        const vaccination = await Vaccination.findById(req.params.id);
        if (!vaccination) {
            return res.status(404).json({ message: 'Vaccination record not found' });
        }

        // Check if user is the administrator of the vaccination
        if (vaccination.administeredBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await vaccination.remove();
        res.json({ message: 'Vaccination record removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all vaccinations for a specific animal
 * @route   GET /api/vaccinations/animal/:animalId
 * @access  Private
 */
exports.getAnimalVaccinations = async (req, res) => {
    try {
        const vaccinations = await Vaccination.find({ animal: req.params.animalId })
            .populate('administeredBy', 'name')
            .sort({ date: -1 });

        res.json(vaccinations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get upcoming vaccinations
 * @route   GET /api/vaccinations/upcoming
 * @access  Private
 */
exports.getUpcomingVaccinations = async (req, res) => {
    try {
        const today = new Date();
        const vaccinations = await Vaccination.find({
            nextDueDate: { $gt: today },
            status: 'completed'
        })
            .populate('animal', 'tagNumber species breed')
            .populate('administeredBy', 'name')
            .sort({ nextDueDate: 1 });

        res.json(vaccinations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get overdue vaccinations
 * @route   GET /api/vaccinations/overdue
 * @access  Private
 */
exports.getOverdueVaccinations = async (req, res) => {
    try {
        const today = new Date();
        const vaccinations = await Vaccination.find({
            nextDueDate: { $lt: today },
            status: 'completed'
        })
            .populate('animal', 'tagNumber species breed')
            .populate('administeredBy', 'name')
            .sort({ nextDueDate: 1 });

        res.json(vaccinations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 