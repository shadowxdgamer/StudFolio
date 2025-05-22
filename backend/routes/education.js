const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  addEducation,
  getEducation,
  updateEducation,
  deleteEducation
} = require('../controllers/educationController');
const { protect } = require('../middleware/auth');
const { educationValidation } = require('../middleware/validator');

router.post('/', protect, educationValidation, addEducation);
router.get('/', protect, getEducation);
router.put('/:id', protect, educationValidation, updateEducation);
router.delete('/:id', protect, deleteEducation);

module.exports = router;
