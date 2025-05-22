const express = require('express');
const router = express.Router();
const { generateCV } = require('../controllers/cvController');
const { protect } = require('../middleware/auth');

router.get('/generate', protect, generateCV);

module.exports = router;
