const express = require('express');
const router = express.Router();
const { generateCV, getCVPreview } = require('../controllers/cvController');
const { protect } = require('../middleware/auth');

// Route to generate PDF CV
router.get('/generate', protect, generateCV);

// Route to get CV preview data
router.get('/preview', protect, getCVPreview);

module.exports = router;
