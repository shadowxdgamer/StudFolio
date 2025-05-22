const Language = require('../models/Language');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

/**
 * @desc    Add language to profile
 * @route   POST /api/v1/profile/languages
 * @access  Private
 */
exports.addLanguage = asyncHandler(async (req, res, next) => {
    // Check validation results from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Create new language
    const newLanguage = {
        profile: profile._id,
        ...req.body
    };

    const language = await Language.create(newLanguage);

    res.status(201).json({
        success: true,
        data: language
    });
});

/**
 * @desc    Get all languages for a profile
 * @route   GET /api/v1/profile/languages
 * @access  Private
 */
exports.getLanguages = asyncHandler(async (req, res, next) => {
    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Get all languages for this profile
    const languages = await Language.find({ profile: profile._id });

    res.status(200).json({
        success: true,
        count: languages.length,
        data: languages
    });
});

/**
 * @desc    Update language
 * @route   PUT /api/v1/profile/languages/:id
 * @access  Private
 */
exports.updateLanguage = asyncHandler(async (req, res, next) => {
    // Check validation results from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Find language by id
    let language = await Language.findById(req.params.id);

    if (!language) {
        return next(new ErrorResponse('Language not found', 404));
    }

    // Make sure user owns the language record
    if (language.profile.toString() !== profile._id.toString()) {
        return next(new ErrorResponse('Not authorized to update this language', 401));
    }

    // Update language
    language = await Language.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: language
    });
});

/**
 * @desc    Delete language
 * @route   DELETE /api/v1/profile/languages/:id
 * @access  Private
 */
exports.deleteLanguage = asyncHandler(async (req, res, next) => {
    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Find language by id
    const language = await Language.findById(req.params.id);

    if (!language) {
        return next(new ErrorResponse('Language not found', 404));
    }

    // Make sure user owns the language record
    if (language.profile.toString() !== profile._id.toString()) {
        return next(new ErrorResponse('Not authorized to delete this language', 401));
    }

    // Delete language
    await language.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});