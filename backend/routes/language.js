const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  addLanguage,
  getLanguages,
  updateLanguage,
  deleteLanguage
} = require('../controllers/languageController');
const { protect } = require('../middleware/auth');
const { languageValidation } = require('../middleware/validator');

router.post('/', protect, languageValidation, addLanguage);
router.get('/', protect, getLanguages);
router.put('/:id', protect, languageValidation, updateLanguage);
router.delete('/:id', protect, deleteLanguage);

module.exports = router;
