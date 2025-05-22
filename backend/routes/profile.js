const express = require('express');
const router = express.Router();
const {
    createProfile,
    getMyProfile,
    getProfileByUserId,
    getAllProfiles,
    deleteProfile,
    updateSocialLinks
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const {
    profileValidation,
    socialLinksValidation
} = require('../middleware/validator');

// Profile CRUD routes
router.post('/', protect, profileValidation, createProfile);
router.get('/me', protect, getMyProfile);
router.get('/user/:userId', getProfileByUserId);
router.get('/', getAllProfiles);
router.delete('/', protect, deleteProfile);

// Social links routes
router.put('/social', protect, socialLinksValidation, updateSocialLinks);

module.exports = router;
