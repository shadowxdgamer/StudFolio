const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    addSkill,
    getSkills,
    updateSkill,
    deleteSkill
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');
const { skillValidation } = require('../middleware/validator');

router.post('/', protect, skillValidation, addSkill);
router.get('/', protect, getSkills);
router.put('/:id', protect, skillValidation, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
