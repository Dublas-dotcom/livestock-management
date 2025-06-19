const HealthRecord = require('../models/HealthRecord');
const Animal = require('../models/Animal');

/**
 * @desc    Get all health records with pagination
 * @route   GET /api/health-records
 * @access  Private
 */
exports.getAllHealthRecords = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const healthRecords = await HealthRecord.find()
            .populate('animal', 'tagNumber species breed')
            .populate('veterinarian', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 });

        const total = await HealthRecord.countDocuments();

        res.json({
            healthRecords,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get health record by ID
 * @route   GET /api/health-records/:id
 * @access  Private
 */
exports.getHealthRecordById = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id)
            .populate('animal', 'tagNumber species breed')
            .populate('veterinarian', 'name');

        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        res.json(healthRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create new health record
 * @route   POST /api/health-records
 * @access  Private
 */
exports.createHealthRecord = async (req, res) => {
    try {
        const {
            animal,
            recordType,
            diagnosis,
            treatment,
            medications,
            vitalSigns,
            followUpDate,
            notes
        } = req.body;

        // Check if animal exists
        const animalExists = await Animal.findById(animal);
        if (!animalExists) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        const healthRecord = new HealthRecord({
            animal,
            recordType,
            diagnosis,
            treatment,
            medications,
            vitalSigns,
            veterinarian: req.user.id,
            followUpDate,
            notes
        });

        await healthRecord.save();
        res.status(201).json(healthRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update health record
 * @route   PUT /api/health-records/:id
 * @access  Private
 */
exports.updateHealthRecord = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        // Check if user is the veterinarian who created the record
        if (healthRecord.veterinarian.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedHealthRecord = await HealthRecord.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedHealthRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Delete health record
 * @route   DELETE /api/health-records/:id
 * @access  Private
 */
exports.deleteHealthRecord = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        // Check if user is the veterinarian who created the record
        if (healthRecord.veterinarian.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await healthRecord.remove();
        res.json({ message: 'Health record removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all health records for a specific animal
 * @route   GET /api/health-records/animal/:animalId
 * @access  Private
 */
exports.getAnimalHealthRecords = async (req, res) => {
    try {
        const healthRecords = await HealthRecord.find({ animal: req.params.animalId })
            .populate('veterinarian', 'name')
            .sort({ date: -1 });

        res.json(healthRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get health records requiring follow-up
 * @route   GET /api/health-records/follow-up
 * @access  Private
 */
exports.getFollowUpRecords = async (req, res) => {
    try {
        const today = new Date();
        const healthRecords = await HealthRecord.find({
            followUpDate: { $gt: today },
            status: { $in: ['active', 'ongoing'] }
        })
            .populate('animal', 'tagNumber species breed')
            .populate('veterinarian', 'name')
            .sort({ followUpDate: 1 });

        res.json(healthRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Add attachment to health record
 * @route   POST /api/health-records/:id/attachments
 * @access  Private
 */
exports.addAttachment = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        // Check if user is the veterinarian who created the record
        if (healthRecord.veterinarian.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { type, url, description } = req.body;
        healthRecord.attachments.push({
            type,
            url,
            description,
            uploadedAt: new Date()
        });

        await healthRecord.save();
        res.json(healthRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Remove attachment from health record
 * @route   DELETE /api/health-records/:id/attachments/:attachmentId
 * @access  Private
 */
exports.removeAttachment = async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findById(req.params.id);
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }

        // Check if user is the veterinarian who created the record
        if (healthRecord.veterinarian.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        healthRecord.attachments = healthRecord.attachments.filter(
            attachment => attachment._id.toString() !== req.params.attachmentId
        );

        await healthRecord.save();
        res.json(healthRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 