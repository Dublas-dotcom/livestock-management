/* 
 * Animal Controller for VaxWise application
 * Handles CRUD operations for livestock records
 */

const Animal = require('../models/Animal');
const { AppError } = require('../middleware/error');

// @desc    Get all animals for a farmer
// @route   GET /api/animals
// @access  Private
exports.getAnimals = async (req, res, next) => {
    try {
        const animals = await Animal.find({ farmer: req.user.id })
            .populate('vaccinations.vaccine')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: animals.length,
            data: animals
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single animal
// @route   GET /api/animals/:id
// @access  Private
exports.getAnimal = async (req, res, next) => {
    try {
        const animal = await Animal.findOne({
            _id: req.params.id,
            farmer: req.user.id
        }).populate('vaccinations.vaccine');

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        res.status(200).json({
            success: true,
            data: animal
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new animal
// @route   POST /api/animals
// @access  Private
exports.createAnimal = async (req, res, next) => {
    try {
        // Add farmer to request body
        req.body.farmer = req.user.id;

        const animal = await Animal.create(req.body);

        res.status(201).json({
            success: true,
            data: animal
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update animal
// @route   PUT /api/animals/:id
// @access  Private
exports.updateAnimal = async (req, res, next) => {
    try {
        let animal = await Animal.findOne({
            _id: req.params.id,
            farmer: req.user.id
        });

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        animal = await Animal.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: animal
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete animal
// @route   DELETE /api/animals/:id
// @access  Private
exports.deleteAnimal = async (req, res, next) => {
    try {
        const animal = await Animal.findOne({
            _id: req.params.id,
            farmer: req.user.id
        });

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        await animal.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add vaccination record
// @route   POST /api/animals/:id/vaccinations
// @access  Private
exports.addVaccination = async (req, res, next) => {
    try {
        const animal = await Animal.findOne({
            _id: req.params.id,
            farmer: req.user.id
        });

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        animal.vaccinations.push(req.body);
        await animal.save();

        res.status(200).json({
            success: true,
            data: animal
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update vaccination record
// @route   PUT /api/animals/:id/vaccinations/:vaccinationId
// @access  Private
exports.updateVaccination = async (req, res, next) => {
    try {
        const animal = await Animal.findOne({
            _id: req.params.id,
            farmer: req.user.id
        });

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        const vaccination = animal.vaccinations.id(req.params.vaccinationId);
        if (!vaccination) {
            return next(new AppError('Vaccination record not found', 404));
        }

        Object.assign(vaccination, req.body);
        await animal.save();

        res.status(200).json({
            success: true,
            data: animal
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete vaccination record
// @route   DELETE /api/animals/:id/vaccinations/:vaccinationId
// @access  Private
exports.deleteVaccination = async (req, res, next) => {
    try {
        const animal = await Animal.findOne({
            _id: req.params.id,
            farmer: req.user.id
        });

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        animal.vaccinations.pull(req.params.vaccinationId);
        await animal.save();

        res.status(200).json({
            success: true,
            data: animal
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add medical record
// @route   POST /api/animals/:id/medical
// @access  Private
exports.addMedicalRecord = async (req, res, next) => {
    try {
        const animal = await Animal.findOne({
            _id: req.params.id,
            farmer: req.user.id
        });

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        animal.medicalHistory.push(req.body);
        await animal.save();

        res.status(200).json({
            success: true,
            data: animal
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get vaccination schedule
// @route   GET /api/animals/:id/schedule
// @access  Private
exports.getVaccinationSchedule = async (req, res, next) => {
    try {
        const animal = await Animal.findOne({
            _id: req.params.id,
            farmer: req.user.id
        }).populate('vaccinations.vaccine');

        if (!animal) {
            return next(new AppError('Animal not found', 404));
        }

        // Calculate upcoming vaccinations
        const schedule = animal.vaccinations.map(vaccination => ({
            vaccine: vaccination.vaccine,
            lastDate: vaccination.date,
            nextDueDate: vaccination.nextDueDate,
            status: vaccination.nextDueDate < new Date() ? 'overdue' : 'upcoming'
        }));

        res.status(200).json({
            success: true,
            data: schedule
        });
    } catch (err) {
        next(err);
    }
}; 