const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    addExperience,
    getExperience,
    updateExperience,
    deleteExperience
} = require('../controllers/experienceController');
const { protect } = require('../middleware/auth');
const { experienceValidation } = require('../middleware/validator');

router.post('/', protect, experienceValidation, addExperience);
router.get('/', protect, getExperience);
router.put('/:id', protect, experienceValidation, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;
